// types/upload.ts
export interface UploadTask {
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
  lastUpdated: number;
  retryCount?: number;
}

export interface UploadProgressEvent extends ProgressEvent {
  lengthComputable: boolean;
  loaded: number;
  total: number;
}

export interface PresignedUrlResponse {
  upload_url: string;
  file_url: string;
}

export interface StoreMetadataResponse {
  media_id: number;
  success: boolean;
}

export interface UseUploadServiceReturn {
  tasks: UploadTask[];
  addUploadTask: (file: File, collectionName: string) => Promise<string>;
  removeTask: (taskId: string) => Promise<void>;
  getCompletedMediaIds: () => Promise<number[]>;
  isServiceWorkerSupported: boolean;
  retryTask: (taskId: string) => Promise<void>;
}
