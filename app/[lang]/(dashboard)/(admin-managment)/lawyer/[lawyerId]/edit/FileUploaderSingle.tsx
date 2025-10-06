"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
import toast from "react-hot-toast";
import { api } from "@/services/axios";

interface FileProgress {
  id: string;
  file: {
    image_id?: number;
    url?: string;
    image_name: string;
    size?: number;
    type?: string;
  };
  status: "pending" | "uploading" | "completed" | "error" | "existing";
  progress: number;
  error?: string;
  fileUrl?: string;
  mediaId?: number;
}

interface ExistingFile {
  image_id: number;
  url: string;
  image_name: string;
}

interface FileUploaderSingleProps {
  fileType: string;
  fileIds: number[];
  setFileIds: (ids: number[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  existingFiles?: ExistingFile[];
}

const FileUploaderSingle = ({
  fileType,
  fileIds,
  setFileIds,
  maxFiles = 1, // Default to 1 file
  maxSizeMB = 200,
  accept = { "*/*": [] },
  existingFiles = [],
}: FileUploaderSingleProps) => {
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslate();
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const MAX_FILE_SIZE_BYTES = maxSizeMB * 1024 * 1024;

  // ✅ Detect type from extension
  const getFileTypeFromExtension = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext))
      return "image";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx"].includes(ext)) return "word";
    if (["xls", "xlsx"].includes(ext)) return "excel";
    if (["ppt", "pptx"].includes(ext)) return "powerpoint";
    if (["zip", "rar", "7z"].includes(ext)) return "archive";
    return "file";
  };

  // ✅ Get file icon based on type
  const getFileIcon = (fileType: string) => {
    const iconMap: Record<string, string> = {
      image: "tabler:photo",
      video: "tabler:video",
      pdf: "tabler:file-text",
      word: "tabler:file-type-doc",
      excel: "tabler:file-type-xls",
      powerpoint: "tabler:file-type-ppt",
      archive: "tabler:archive",
      file: "tabler:file-description",
    };
    return iconMap[fileType] || "tabler:file-description";
  };

  // ✅ Initialize with existing files
  useEffect(() => {
    if (!existingFiles || existingFiles.length === 0) {
      setFileProgresses([]);
      return;
    }

    // For single file upload, only take the first file
    const firstFile = existingFiles[0];
    const fileType = getFileTypeFromExtension(firstFile.image_name);

    const existingFileProgress: FileProgress = {
      id: `existing-${firstFile.image_id}`,
      file: {
        image_id: firstFile.image_id,
        url: firstFile.url,
        image_name: firstFile.image_name,
        type: fileType,
      },
      status: "existing",
      progress: 100,
      fileUrl: firstFile.url,
      mediaId: firstFile.image_id,
    };

    setFileProgresses([existingFileProgress]);

    // ✅ Ensure fileIds contains the existing ID
    if (firstFile.image_id && !fileIds.includes(firstFile.image_id)) {
      setFileIds([firstFile.image_id]);
    }
  }, [existingFiles, fileIds, setFileIds]);

  // ✅ Presigned URL
  const getPresignedUrl = async (
    fileName: string,
    fileType: string
  ): Promise<{ upload_url: string; file_url: string }> => {
    const { data } = await api.post("/user/b2/presigned-url", {
      file_name: fileName,
      file_type: fileType,
    });
    return data;
  };

  // ✅ Store metadata
  const storeFileMetadata = async (fileData: {
    file_url: string;
    file_name: string;
    collection_name: string;
    mime_type: string;
    size: number;
  }) => {
    const formData = new FormData();
    Object.entries(fileData).forEach(([k, v]) =>
      formData.append(k, v.toString())
    );

    const { data } = await api.post("/user/b2/store-meta", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  };

  // ✅ Upload to S3
  const uploadFileToS3 = (
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`S3 upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open("PUT", uploadUrl, true);
      xhr.send(file);
    });
  };

  // ✅ Upload pipeline
  const uploadFile = async (
    file: File,
    fileId: string,
    onProgress?: (progress: number) => void,
    signal?: AbortSignal
  ): Promise<{ fileUrl: string; mediaId: number }> => {
    const presigned = await getPresignedUrl(file.name, fileType);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    await uploadFileToS3(file, presigned.upload_url, onProgress);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const meta = await storeFileMetadata({
      file_url: presigned.file_url,
      file_name: file.name,
      collection_name: fileType,
      mime_type: file.type,
      size: file.size,
    });

    return { fileUrl: presigned.file_url, mediaId: meta.media_id };
  };

  // ✅ Drop handler - Modified for single file replacement
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // For single file upload, only process the first file
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0]; // Take only the first file

      console.log('📤 Starting file upload:', file.name);
      console.log('📋 Current fileIds before replacement:', fileIds);

      // Clear ALL existing files when new file is dropped (replacement behavior)
      setFileProgresses([]);

      const newFileProgress: FileProgress = {
        id: `new-${Math.random().toString(36).substring(2, 9)}`,
        file: {
          image_name: file.name,
          size: file.size,
          type: getFileTypeFromExtension(file.name),
        },
        status: "pending",
        progress: 0,
      };

      setFileProgresses([newFileProgress]);
      setIsProcessing(true);

      const controller = new AbortController();
      abortControllers.current.set(newFileProgress.id, controller);

      try {
        setFileProgresses((prev) =>
          prev.map((p) =>
            p.id === newFileProgress.id ? { ...p, status: "uploading" } : p
          )
        );

        const { fileUrl, mediaId } = await uploadFile(
          file,
          newFileProgress.id,
          (progress) =>
            setFileProgresses((prev) =>
              prev.map((p) =>
                p.id === newFileProgress.id ? { ...p, progress } : p
              )
            ),
          controller.signal
        );

        console.log('✅ File upload completed, new mediaId:', mediaId);
        
        setFileProgresses((prev) =>
          prev.map((p) =>
            p.id === newFileProgress.id
              ? { ...p, status: "completed", progress: 100, fileUrl, mediaId }
              : p
          )
        );

        // REPLACE all file IDs with the new single ID
        setFileIds([mediaId]);
        console.log('🔄 File IDs after replacement:', [mediaId]);

      } catch (e) {
        console.error('❌ File upload failed:', e);
        setFileProgresses((prev) =>
          prev.map((p) =>
            p.id === newFileProgress.id
              ? {
                  ...p,
                  status: "error",
                  error: (e as Error).message,
                  progress: 0,
                }
              : p
          )
        );
      } finally {
        abortControllers.current.delete(newFileProgress.id);
        setIsProcessing(false);
      }
    },
    [fileIds, setFileIds, fileType]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1, // Only allow 1 file
    maxSize: MAX_FILE_SIZE_BYTES,
    accept,
    onDrop,
    disabled: isProcessing,
  });

  // ✅ Remove file
  const handleRemoveFile = (fileId: string, mediaId?: number) => {
    console.log('🗑️ Removing file:', fileId, 'mediaId:', mediaId);
    
    // Cancel upload if in progress
    const controller = abortControllers.current.get(fileId);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(fileId);
    }

    // Clear ALL files (single file behavior)
    setFileProgresses([]);

    if (mediaId) {
      // Clear ALL file IDs
      setFileIds([]);
      console.log('🔄 File IDs after removal:', []);
    }
  };

  // ✅ File Icon Renderer
  const renderFilePreview = (fp: FileProgress) => {
    // For images with valid URLs
    if (fp.file.type === "image" && fp.fileUrl) {
      return (
        <div className="w-12 h-12 relative">
          <Image
            fill
            alt={fp.file.image_name}
            src={fp.fileUrl}
            className="rounded object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      );
    }

    // For all other file types
    return (
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
        <Icon
          icon={getFileIcon(fp.file.type || "file")}
          className="w-6 h-6 text-blue-500"
        />
      </div>
    );
  };

  // ✅ Get status text
  const getStatusText = (fp: FileProgress) => {
    const statusMap = {
      pending: t("في الانتظار"),
      uploading: t("جاري الرفع"),
      completed: t("مكتمل"),
      error: t("خطأ"),
      existing: t("موجود"),
    };
    return statusMap[fp.status] || fp.status;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isProcessing ? "opacity-50" : "hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
        )}
        <p className="mt-2">{t("اسحب وأسقط الملف أو انقر للتصفح")}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t(`ملف واحد فقط، الحجم الأقصى: ${maxSizeMB}MB`)}
        </p>
      </div>

      {fileProgresses.length > 0 && (
        <div className="mt-6 grid gap-3">
          {fileProgresses.map((fp) => (
            <div
              key={fp.id}
              className={`flex items-center justify-between border p-3 rounded ${
                fp.status === "error" ? "border-destructive" : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {renderFilePreview(fp)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fp.file.image_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs ${
                        fp.status === "error"
                          ? "text-destructive"
                          : fp.status === "completed" ||
                            fp.status === "existing"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {getStatusText(fp)}
                    </span>
                    {fp.status === "uploading" && (
                      <span className="text-xs text-gray-500">
                        • {Math.round(fp.progress)}%
                      </span>
                    )}
                  </div>
                  {fp.mediaId && (
                    <p className="text-xs text-blue-500 mt-1">
                      ID: {fp.mediaId}
                    </p>
                  )}
                  {fp.error && (
                    <p className="text-xs text-destructive mt-1">{fp.error}</p>
                  )}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRemoveFile(fp.id, fp.mediaId)}
                disabled={fp.status === "uploading"}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploaderSingle;