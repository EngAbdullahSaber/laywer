// public/sw.js
const CACHE_NAME = "file-uploader-v1";
const DB_NAME = "UploadQueue";
const STORE_NAME = "files";

// Install event
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Background Sync for retrying failed uploads
self.addEventListener("sync", (event) => {
  if (event.tag === "background-upload") {
    event.waitUntil(processUploadQueue());
  }
});

// Open IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("status", "status", { unique: false });
      }
    };
  });
};

// Save file to IndexedDB
const saveToQueue = async (fileData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(fileData);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Get all pending uploads
const getPendingUploads = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("status");
    const request = index.getAll("pending");

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Update upload status
const updateUploadStatus = async (id, updates) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        const updatedData = { ...data, ...updates };
        const putRequest = store.put(updatedData);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve(updatedData);
      }
    };
  });
};

// Remove from queue
const removeFromQueue = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Process upload queue
const processUploadQueue = async () => {
  try {
    const pendingUploads = await getPendingUploads();

    for (const upload of pendingUploads) {
      try {
        await updateUploadStatus(upload.id, { status: "processing" });

        // Convert base64 back to blob
        const response = await fetch(upload.fileData);
        const fileBlob = await response.blob();

        // Get presigned URL
        const presignedResponse = await fetch("/api/presigned-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: upload.fileName,
            file_type: upload.fileType,
          }),
        });

        if (!presignedResponse.ok)
          throw new Error("Failed to get presigned URL");
        const presignedData = await presignedResponse.json();

        // Upload to S3
        const uploadResponse = await fetch(presignedData.upload_url, {
          method: "PUT",
          body: fileBlob,
        });

        if (!uploadResponse.ok) throw new Error("S3 upload failed");

        // Store metadata
        const metaResponse = await fetch("/api/store-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_url: presignedData.file_url,
            file_name: upload.fileName,
            collection_name: upload.fileType,
            mime_type: upload.mimeType,
            size: upload.size,
          }),
        });

        if (!metaResponse.ok) throw new Error("Failed to store metadata");
        const metaData = await metaResponse.json();

        // Update status and notify client
        await updateUploadStatus(upload.id, {
          status: "completed",
          mediaId: metaData.media_id,
          fileUrl: presignedData.file_url,
        });

        // Notify all clients
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "UPLOAD_COMPLETED",
            payload: {
              id: upload.id,
              mediaId: metaData.media_id,
              fileUrl: presignedData.file_url,
            },
          });
        });

        // Remove from queue after successful upload
        await removeFromQueue(upload.id);
      } catch (error) {
        await updateUploadStatus(upload.id, {
          status: "error",
          error: error.message,
        });

        // Notify clients about error
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "UPLOAD_ERROR",
            payload: {
              id: upload.id,
              error: error.message,
            },
          });
        });
      }
    }
  } catch (error) {
    console.error("Background sync error:", error);
  }
};
