// public/sw.js
self.addEventListener("install", () => {
  console.log("SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("SW activated");
  event.waitUntil(self.clients.claim());
});

// IndexedDB helper (simplified)
const DB_NAME = "upload-queue";
const DB_STORE = "files";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(DB_STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

async function saveFile(data) {
  const db = await openDB();
  const tx = db.transaction(DB_STORE, "readwrite");
  tx.objectStore(DB_STORE).put(data);
  return tx.complete;
}

async function getFiles() {
  const db = await openDB();
  const tx = db.transaction(DB_STORE, "readonly");
  const store = tx.objectStore(DB_STORE);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

async function removeFile(id) {
  const db = await openDB();
  const tx = db.transaction(DB_STORE, "readwrite");
  tx.objectStore(DB_STORE).delete(id);
  return tx.complete;
}

// Background Sync trigger
self.addEventListener("sync", (event) => {
  if (event.tag === "background-upload") {
    event.waitUntil(processQueue());
  }
});

// Handle messages from React app
self.addEventListener("message", async (event) => {
  const { type, payload } = event.data;

  if (type === "QUEUE_UPLOAD") {
    await saveFile(payload);
    if (self.registration.sync) {
      await self.registration.sync.register("background-upload");
    } else {
      processQueue(); // fallback
    }
  }

  if (type === "GET_UPLOADS") {
    const files = await getFiles();
    event.source.postMessage({ type: "UPLOADS", payload: files });
  }
});

// Process upload queue
async function processQueue() {
  const files = await getFiles();

  for (const file of files) {
    try {
      // Step 1 → getPresignedUrl
      const presignedRes = await fetch("/user/b2/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.fileName,
          file_type: file.fileType,
        }),
      });
      const presigned = await presignedRes.json();

      // Step 2 → store metadata
      const metaForm = new FormData();
      metaForm.append("file_url", presigned.file_url);
      metaForm.append("file_name", file.fileName);
      metaForm.append("collection_name", file.fileType);
      metaForm.append("mime_type", file.mimeType);
      metaForm.append("size", file.size);

      const metaRes = await fetch("/user/b2/store-meta", {
        method: "POST",
        body: metaForm,
      });
      const meta = await metaRes.json();

      // Step 3 → upload to S3
      const blob = await (await fetch(file.fileData)).blob();
      await fetch(presigned.upload_url, {
        method: "PUT",
        body: blob,
      });

      // ✅ Done → remove from queue
      await removeFile(file.id);

      // Notify React app if active
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({
            type: "UPLOAD_COMPLETED",
            payload: {
              id: file.id,
              fileUrl: presigned.file_url,
              mediaId: meta.media_id,
            },
          })
        );
      });
    } catch (err) {
      console.error("Upload failed:", err);
      // Keep file in DB for retry on next sync
    }
  }
}
