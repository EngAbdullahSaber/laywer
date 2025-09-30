"use client";
import { useState, useCallback, useRef } from "react";
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
  file: File;
  status: "pending" | "uploading" | "completed" | "error";
  progress: number;
  error?: string;
  fileUrl?: string;
  mediaId?: number;
}

interface FileUploaderSingleProps {
  fileType: string;
  fileId: number | null;
  setFileId: (id: number | null) => Promise<void>;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
}

const FileUploaderSingle = ({
  fileType,
  fileId,
  setFileId,
  maxSizeMB = 200,
  accept = { "*/*": [] },
}: FileUploaderSingleProps) => {
  const [fileProgress, setFileProgress] = useState<FileProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslate();
  const abortController = useRef<AbortController | null>(null);

  const MAX_FILE_SIZE_BYTES = maxSizeMB * 1024 * 1024;

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

  const storeFileMetadata = async (fileData: {
    file_url: string;
    file_name: string;
    collection_name: string;
    mime_type: string;
    size: number;
  }): Promise<{ media_id: number }> => {
    const formData = new FormData();
    formData.append("file_url", fileData.file_url);
    formData.append("file_name", fileData.file_name);
    formData.append("collection_name", fileData.collection_name);
    formData.append("mime_type", fileData.mime_type);
    formData.append("size", fileData.size.toString());

    const response = await api.post("/user/b2/store-meta", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const uploadFileToS3 = async (
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(
              new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`)
            );
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error("Network error occurred"));
      };

      xhr.open("PUT", uploadUrl, true);
      xhr.send(file);
    });
  };

  const uploadSingleFile = async (
    file: File,
    onProgress?: (progress: number) => void,
    signal?: AbortSignal
  ): Promise<{ mediaId: number }> => {
    // Step 1: Get presigned URL
    const presignedData = await getPresignedUrl(file.name, fileType);

    if (signal?.aborted) {
      throw new DOMException("تم إلغاء الرفع", "AbortError");
    }

    // Step 2: Upload to S3
    await uploadFileToS3(file, presignedData.upload_url, onProgress);

    if (signal?.aborted) {
      throw new DOMException("تم إلغاء الرفع", "AbortError");
    }

    // Step 3: Store file metadata and get media_id
    const metaResponse = await storeFileMetadata({
      file_url: presignedData.file_url,
      file_name: file.name,
      collection_name: fileType,
      mime_type: file.type,
      size: file.size,
    });

    return {
      mediaId: metaResponse.media_id,
    };
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        const fileTooLarge = fileRejections.some((rejection) =>
          rejection.errors.some((e) => e.code === "file-too-large")
        );

        if (fileTooLarge) {
          toast.error(t(`الحد الأقصى لحجم الملف هو ${maxSizeMB} ميجابايت`));
          return;
        }

        toast.error(t("تم رفض الملف. يرجى التحقق من نوع وحجم الملف."));
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsProcessing(true);

      const newFileProgress: FileProgress = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        status: "pending",
        progress: 0,
      };

      setFileProgress(newFileProgress);

      try {
        abortController.current = new AbortController();

        setFileProgress((prev) =>
          prev ? { ...prev, status: "uploading", progress: 0 } : null
        );

        const result = await uploadSingleFile(
          file,
          (progress) => {
            setFileProgress((prev) => (prev ? { ...prev, progress } : null));
          },
          abortController.current.signal
        );

        if (abortController.current.signal.aborted) {
          throw new DOMException("تم إلغاء الرفع", "AbortError");
        }

        setFileProgress((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                progress: 100,
                mediaId: result.mediaId,
              }
            : null
        );

        // Update parent component with new file ID
        await setFileId(result.mediaId);
        toast.success(t("تم رفع الملف بنجاح"));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setFileProgress(null);
        } else {
          setFileProgress((prev) =>
            prev
              ? {
                  ...prev,
                  status: "error",
                  error: error instanceof Error ? error.message : "فشل الرفع",
                }
              : null
          );
          toast.error(t("فشل رفع الملف"));
        }
      } finally {
        abortController.current = null;
        setIsProcessing(false);
      }
    },
    [setFileId, t, maxSizeMB, fileType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    accept,
    onDrop,
    disabled: isProcessing,
  });

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <Image
          width={48}
          height={48}
          alt={file.name}
          src={URL.createObjectURL(file)}
          className="rounded border p-0.5 object-cover"
        />
      );
    } else {
      const extension = file.name.split(".").pop()?.toLowerCase();
      let icon = "tabler:file-description";

      if (extension === "pdf") icon = "tabler:file-type-pdf";
      else if (["doc", "docx"].includes(extension || ""))
        icon = "tabler:file-type-doc";
      else if (["xls", "xlsx"].includes(extension || ""))
        icon = "tabler:file-type-xls";
      else if (["mp4", "mov", "avi"].includes(extension || ""))
        icon = "tabler:file-video";
      else if (["mp3", "wav", "ogg"].includes(extension || ""))
        icon = "tabler:file-music";

      return <Icon icon={icon} className="h-10 w-10 text-blue-500" />;
    }
  };

  const handleRemoveFile = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!fileProgress) return;

    // If uploading, abort the upload
    if (fileProgress.status === "uploading" && abortController.current) {
      abortController.current.abort();
    }

    // If completed and has mediaId, remove from parent fileId
    if (fileProgress.status === "completed" && fileProgress.mediaId) {
      try {
        await setFileId(null);
        toast.success(t("تم إزالة الملف بنجاح"));
      } catch (error) {
        console.error("Error removing file:", error);
        toast.error(t("فشل إزالة الملف"));
        return;
      }
    }

    // Remove from local state
    setFileProgress(null);
  };

  const formatFileSize = (size: number) => {
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} ميجابايت`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(1)} كيلوبايت`;
    }
    return `${size} بايت`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-gray-500";
      case "uploading":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return (
          <Icon icon="tabler:circle-check" className="h-4 w-4 text-green-500" />
        );
      case "error":
        return (
          <Icon icon="tabler:alert-circle" className="h-4 w-4 text-red-500" />
        );
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("قيد الانتظار");
      case "uploading":
        return t("جاري الرفع");
      case "completed":
        return t("مكتمل");
      case "error":
        return t("خطأ");
      default:
        return status;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 text-sm text-muted-foreground">
        {t("الحد الأقصى")}: 1 {t("ملف")} • {t("الحجم الأقصى")}: {maxSizeMB}{" "}
        ميجابايت
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {isProcessing
                ? t("جاري رفع الملف...")
                : isDragActive
                ? t("إسقاط الملف هنا")
                : fileProgress
                ? t("تم اختيار ملف، انقر لاختيار ملف آخر")
                : t("اسحب وأسقط الملف أو انقر للتصفح")}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            disabled={isProcessing}
          >
            {t("اختر الملف")}
          </Button>
        </div>
      </div>

      {fileProgress && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">{t("الملف المختار")}</h3>
          <div className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {renderFilePreview(fileProgress.file)}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-sm font-medium truncate"
                    title={fileProgress.file.name}
                  >
                    {fileProgress.file.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(fileProgress.file.size)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(fileProgress.status)}
                    <span
                      className={`text-xs ${getStatusColor(
                        fileProgress.status
                      )}`}
                    >
                      {getStatusText(fileProgress.status)}
                    </span>
                    {fileProgress.status === "uploading" && (
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${fileProgress.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(fileProgress.progress)}%
                        </span>
                      </div>
                    )}
                    {fileProgress.mediaId && (
                      <span className="text-xs text-blue-500">
                        ID: {fileProgress.mediaId}
                      </span>
                    )}
                  </div>
                  {fileProgress.error && (
                    <div className="text-xs text-red-500 mt-1">
                      {fileProgress.error}
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploaderSingle;
