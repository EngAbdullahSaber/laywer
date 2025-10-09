// hooks/useUploadService.ts
import { useEffect, useRef, useState } from "react";

interface UploadTask {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  collectionName: string;
  status:
    | "queued"
    | "getting_url"
    | "storing_metadata"
    | "uploading"
    | "completed"
    | "error";
  progress: number;
  error?: string;
  fileUrl?: string;
  mediaId?: number;
  presignedUrl?: string;
  createdAt: number;
}

interface UseUploadServiceReturn {
  tasks: UploadTask[];
  addUploadTask: (file: File, collectionName: string) => Promise<string>;
  removeTask: (taskId: string) => Promise<void>;
  getCompletedMediaIds: () => Promise<number[]>;
  isServiceWorkerSupported: boolean;
}

export const useUploadService = (): UseUploadServiceReturn => {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [isServiceWorkerSupported, setIsServiceWorkerSupported] =
    useState(false);
  const serviceWorkerRef = useRef<ServiceWorker | null>(null);
  const dbRef = useRef<IDBDatabase | null>(null);

  // Initialize IndexedDB
  const initDB = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("FileUploadDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        dbRef.current = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("uploads")) {
          const store = db.createObjectStore("uploads", { keyPath: "id" });
          store.createIndex("status", "status", { unique: false });
        }
      };
    });
  };

  // Get all tasks from IndexedDB
  const loadTasks = async () => {
    if (!dbRef.current) await initDB();
    const transaction = dbRef.current!.transaction(["uploads"], "readonly");
    const store = transaction.objectStore("uploads");

    return new Promise<UploadTask[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        setTasks(result);
        resolve(result);
      };
      request.onerror = () => {
        setTasks([]);
        resolve([]);
      };
    });
  };

  // Add task to IndexedDB
  const addTaskToDB = async (task: UploadTask) => {
    if (!dbRef.current) await initDB();
    const transaction = dbRef.current!.transaction(["uploads"], "readwrite");
    const store = transaction.objectStore("uploads");
    return store.add(task);
  };

  // Update task in IndexedDB
  const updateTaskInDB = async (id: string, updates: Partial<UploadTask>) => {
    if (!dbRef.current) await initDB();
    const transaction = dbRef.current!.transaction(["uploads"], "readwrite");
    const store = transaction.objectStore("uploads");

    return new Promise<void>((resolve) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (task) {
          const updatedTask = { ...task, ...updates };
          store.put(updatedTask);
        }
        resolve();
      };
    });
  };

  // Remove task from IndexedDB
  const removeTaskFromDB = async (id: string) => {
    if (!dbRef.current) await initDB();
    const transaction = dbRef.current!.transaction(["uploads"], "readwrite");
    const store = transaction.objectStore("uploads");
    return store.delete(id);
  };

  // Initialize service worker
  const initServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      setIsServiceWorkerSupported(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        "/upload-service-worker.js"
      );
      setIsServiceWorkerSupported(true);

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );

      // Get active service worker
      serviceWorkerRef.current =
        registration.active || registration.waiting || registration.installing;

      // Handle service worker state changes
      if (registration.installing) {
        registration.installing.addEventListener("statechange", () => {
          if (registration.installing?.state === "activated") {
            serviceWorkerRef.current = registration.active;
          }
        });
      }
    } catch (error) {
      console.warn("Service Worker registration failed:", error);
      setIsServiceWorkerSupported(false);
    }
  };

  // Handle messages from service worker
  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data;

    switch (type) {
      case "UPLOAD_PROGRESS":
        updateTaskInDB(data.taskId, { progress: data.progress });
        loadTasks(); // Refresh tasks
        break;

      case "UPLOAD_COMPLETED":
        updateTaskInDB(data.taskId, { status: "completed", progress: 100 });
        loadTasks();
        break;

      case "UPLOAD_ERROR":
        updateTaskInDB(data.taskId, { status: "error", error: data.error });
        loadTasks();
        break;

      case "GET_STORAGE_ITEM":
        // Service worker requesting localStorage item
        const value = localStorage.getItem(data.key);
        serviceWorkerRef.current?.postMessage({
          type: "STORAGE_ITEM_RESPONSE",
          key: data.key,
          value: value,
        });
        break;

      case "REMOVE_STORAGE_ITEM":
        localStorage.removeItem(data.key);
        break;

      default:
     }
  };

  // Add upload task
  const addUploadTask = async (
    file: File,
    collectionName: string
  ): Promise<string> => {
    const taskId = Math.random().toString(36).substring(2, 9);

    // Convert file to array buffer for storage
    const fileArrayBuffer = await file.arrayBuffer();

    const task: UploadTask = {
      id: taskId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      collectionName: collectionName,
      status: "queued",
      progress: 0,
      createdAt: Date.now(),
    };

    // Store file data in localStorage
    localStorage.setItem(
      `file_${taskId}`,
      JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        data: Array.from(new Uint8Array(fileArrayBuffer)),
      })
    );

    // Add task to IndexedDB
    await addTaskToDB(task);

    // Notify service worker
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: "SCHEDULE_UPLOAD",
        data: task,
      });
    } else {
      // Fallback: process upload in main thread
      await processUploadFallback(task);
    }

    // Refresh tasks
    await loadTasks();

    return taskId;
  };

  // Remove task
  const removeTask = async (taskId: string) => {
    await removeTaskFromDB(taskId);
    localStorage.removeItem(`file_${taskId}`);

    // Notify service worker to cancel if needed
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: "CANCEL_UPLOAD",
        data: { uploadId: taskId },
      });
    }

    await loadTasks();
  };

  // Get completed media IDs
  const getCompletedMediaIds = async (): Promise<number[]> => {
    const allTasks = await loadTasks();
    return allTasks
      .filter((task) => task.status === "completed" && task.mediaId)
      .map((task) => task.mediaId!);
  };

  // Fallback upload processing (when service worker is not available)
  const processUploadFallback = async (task: UploadTask) => {
    try {
      const fileData = JSON.parse(
        localStorage.getItem(`file_${task.id}`) || "{}"
      );
      if (!fileData.data) throw new Error("File data not found");

      const file = new File([new Uint8Array(fileData.data)], fileData.name, {
        type: fileData.type,
      });

      // Step 1: Get presigned URL
      await updateTaskInDB(task.id, { status: "getting_url" });
      const { data: presignedData } = await fetch(
        "/api/user/b2/presigned-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_name: task.fileName,
            file_type: task.collectionName,
          }),
        }
      ).then((res) => res.json());

      await updateTaskInDB(task.id, {
        status: "storing_metadata",
        presignedUrl: presignedData.upload_url,
        fileUrl: presignedData.file_url,
      });

      // Step 2: Store metadata
      const formData = new FormData();
      formData.append("file_url", presignedData.file_url);
      formData.append("file_name", task.fileName);
      formData.append("collection_name", task.collectionName);
      formData.append("mime_type", task.fileType);
      formData.append("size", task.fileSize.toString());

      const { data: metaData } = await fetch("/api/user/b2/store-meta", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      await updateTaskInDB(task.id, {
        status: "uploading",
        mediaId: metaData.media_id,
        progress: 0,
      });

      // Step 3: Upload to S3
      await uploadToS3Fallback(task.id, file, presignedData.upload_url);

      await updateTaskInDB(task.id, {
        status: "completed",
        progress: 100,
      });

      // Clean up
      localStorage.removeItem(`file_${task.id}`);
    } catch (error) {
      await updateTaskInDB(task.id, {
        status: "error",
        error: (error as Error).message,
      });
    } finally {
      await loadTasks();
    }
  };

  // Fallback S3 upload
  const uploadToS3Fallback = (
    taskId: string,
    file: File,
    uploadUrl: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", async (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          await updateTaskInDB(taskId, { progress });
          await loadTasks();
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 upload failed: ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open("PUT", uploadUrl, true);
      xhr.send(file);
    });
  };

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      await initDB();
      await initServiceWorker();
      await loadTasks();
    };

    init();

    // Cleanup
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, []);

  // Periodic task refresh
  useEffect(() => {
    const interval = setInterval(loadTasks, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    tasks,
    addUploadTask,
    removeTask,
    getCompletedMediaIds,
    isServiceWorkerSupported,
  };
};
 