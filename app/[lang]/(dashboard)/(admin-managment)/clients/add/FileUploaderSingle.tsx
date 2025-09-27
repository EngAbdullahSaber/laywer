"use client";
import { useState, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/services/axios";

interface FileProgress {
  id: string;
  file: File;
  status: "pending" | "uploading" | "completed" | "error";
  progress: number;
  error?: string;
  fileUrl?: string;
}

interface FileUploaderMultipleProps {
  fileType: string;
  fileIds: string[];
  onFilesChange: (files: File[], fileType: string) => Promise<void>;
  onFileRemove: (fileId: string, fileType: string) => Promise<void>;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
}

const FileUploaderMultiple = ({
  fileType,
  fileIds,
  onFilesChange,
  onFileRemove,
  maxFiles = 15,
  maxSizeMB = 200,
  accept = { "*/*": [] },
}: FileUploaderMultipleProps) => {
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslate();
  const { lang } = useParams();
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

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

  // ✅ Store file metadata (using form-data like curl)
  const storeFileMetadata = async (fileData: {
    file_url: string;
    file_name: string;
    collection_name: string;
    mime_type: string;
    size: number;
  }): Promise<void> => {
    // Create FormData object to match curl --form
    const formData = new FormData();

    formData.append("file_url", fileData.file_url);
    formData.append("file_name", fileData.file_name);
    formData.append("collection_name", fileData.collection_name);
    formData.append("mime_type", fileData.mime_type);
    formData.append("size", fileData.size.toString());

    await api.post("/user/b2/store-meta", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        // Authorization header will be automatically added by your api instance
      },
    });
  };
  const uploadFileToS3 = async (
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      console.log("Uploading file as binary data:", {
        name: file.name,
        type: file.type,
        size: file.size + " bytes",
        uploadUrl: uploadUrl,
      });

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log("Upload response status:", xhr.status, xhr.statusText);

          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Binary upload successful");
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

      // Use PUT method
      xhr.open("PUT", uploadUrl, true);

      // Try without Content-Type first
      xhr.send(file);
    });
  };
  // Main upload function
  const uploadFile = async (
    file: File,
    fileId: string,
    onProgress?: (progress: number) => void,
    signal?: AbortSignal
  ): Promise<{ file: File; fileUrl: string }> => {
    try {
      // Step 1: Get presigned URL - FIXED: Use fileType instead of file.type
      const presignedData = await getPresignedUrl(file.name, fileType);

      if (signal?.aborted) {
        throw new DOMException("تم إلغاء الرفع", "AbortError");
      }

      // Step 2: Upload to S3 using PUT request
      await uploadFileToS3(file, presignedData.upload_url, onProgress);

      if (signal?.aborted) {
        throw new DOMException("تم إلغاء الرفع", "AbortError");
      }

      // Step 3: Store file metadata
      await storeFileMetadata({
        file_url: presignedData.file_url,
        file_name: file.name,
        collection_name: fileType,
        mime_type: file.type,
        size: file.size,
      });
      return {
        file,
        fileUrl: presignedData.file_url,
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      throw new Error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Process files in parallel
  const processFilesInParallel = async (
    files: File[],
    newFileProgresses: FileProgress[]
  ): Promise<File[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileId = newFileProgresses[index].id;
      const abortController = new AbortController();
      abortControllers.current.set(fileId, abortController);

      try {
        setFileProgresses((prev) =>
          prev.map((fp) =>
            fp.id === fileId ? { ...fp, status: "uploading", progress: 0 } : fp
          )
        );

        const result = await uploadFile(
          file,
          fileId,
          (progress) => {
            setFileProgresses((prev) =>
              prev.map((fp) => (fp.id === fileId ? { ...fp, progress } : fp))
            );
          },
          abortController.signal
        );

        if (abortController.signal.aborted) {
          throw new DOMException("تم إلغاء الرفع", "AbortError");
        }

        setFileProgresses((prev) =>
          prev.map((fp) =>
            fp.id === fileId
              ? {
                  ...fp,
                  status: "completed",
                  progress: 100,
                  fileUrl: result.fileUrl,
                }
              : fp
          )
        );

        return result.file;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log(`تم إلغاء الرفع لـ ${file.name}`);
          setFileProgresses((prev) => prev.filter((fp) => fp.id !== fileId));
          throw error;
        } else {
          console.error("Error uploading file:", error);
          setFileProgresses((prev) =>
            prev.map((fp) =>
              fp.id === fileId
                ? {
                    ...fp,
                    status: "error",
                    error: error instanceof Error ? error.message : "فشل الرفع",
                  }
                : fp
            )
          );
          throw error;
        }
      } finally {
        abortControllers.current.delete(fileId);
      }
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successfulFiles: File[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successfulFiles.push(result.value);
        } else {
          console.error(
            `Failed to upload file: ${files[index].name}`,
            result.reason
          );
        }
      });

      return successfulFiles;
    } catch (error) {
      console.error("Error in parallel processing:", error);
      return [];
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        const tooManyFiles = fileRejections.some((rejection) =>
          rejection.errors.some((e) => e.code === "too-many-files")
        );

        const fileTooLarge = fileRejections.some((rejection) =>
          rejection.errors.some((e) => e.code === "file-too-large")
        );

        if (tooManyFiles) {
          toast.error(t(`يمكنك رفع حتى ${maxFiles} ملفات`));
          return;
        }

        if (fileTooLarge) {
          toast.error(t(`الحد الأقصى لحجم الملف هو ${maxSizeMB} ميجابايت`));
          return;
        }

        toast.error(
          t("تم رفض بعض الملفات. يرجى التحقق من أنواع وأحجام الملفات.")
        );
        return;
      }

      if (fileProgresses.length + acceptedFiles.length > maxFiles) {
        toast.error(t(`يمكنك فقط رفع حتى ${maxFiles} ملفات`));
        return;
      }

      setIsProcessing(true);

      const newFileProgresses: FileProgress[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        status: "pending",
        progress: 0,
      }));

      setFileProgresses((prev) => [...prev, ...newFileProgresses]);

      try {
        const uploadedFiles = await processFilesInParallel(
          acceptedFiles,
          newFileProgresses
        );

        if (uploadedFiles.length > 0) {
          await onFilesChange(uploadedFiles, fileType);
          toast.success(t("تم رفع الملفات بنجاح"));
        } else {
          toast.error(t("فشل رفع جميع الملفات"));
        }
      } catch (error) {
        console.error("Error in file processing:", error);
        toast.error(t("فشل معالجة بعض الملفات"));
      } finally {
        setIsProcessing(false);
      }
    },
    [fileProgresses.length, maxFiles, onFilesChange, fileType, t, maxSizeMB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    maxSize: MAX_FILE_SIZE_BYTES,
    accept,
    onDrop,
    disabled: isProcessing || fileProgresses.length >= maxFiles,
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

  const handleRemoveFile = async (
    fileId: string,
    fileIndex: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const fileProgress = fileProgresses.find((fp) => fp.id === fileId);
    if (!fileProgress) return;

    if (fileProgress.status === "uploading") {
      const controller = abortControllers.current.get(fileId);
      if (controller) {
        controller.abort();
      }
      return;
    }

    if (fileIndex < fileIds.length) {
      try {
        await onFileRemove(fileIds[fileIndex], fileType);
        toast.success(t("تم إزالة الملف بنجاح"));
      } catch (error) {
        console.error("Error removing file:", error);
        toast.error(t("فشل إزالة الملف"));
        return;
      }
    }

    setFileProgresses((prev) => prev.filter((fp) => fp.id !== fileId));
  };

  const formatFileSize = (size: number) => {
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} ميجابايت`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(1)} كيلوبايت`;
    }
    return `${size} بايت`;
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toUpperCase() || "ملف";
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
        {t("الحد الأقصى")}: {maxFiles} {t("ملفات")} • {t("الحجم الأقصى")}:{" "}
        {maxSizeMB} ميجابايت
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25"
        } ${
          isProcessing || fileProgresses.length >= maxFiles
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
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
                ? t("جاري رفع الملفات...")
                : isDragActive
                ? t("إسقاط الملفات هنا")
                : fileProgresses.length >= maxFiles
                ? t("تم الوصول إلى الحد الأقصى للملفات")
                : t("اسحب وأسقط الملفات أو انقر للتصفح")}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("يدعم أنواع ملفات مختلفة")}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            disabled={isProcessing || fileProgresses.length >= maxFiles}
          >
            {t("اختر الملفات")}
          </Button>
        </div>
      </div>

      {fileProgresses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">
            {t("الملفات")} ({fileProgresses.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fileProgresses.map((fileProgress, index) => (
              <div
                key={fileProgress.id}
                className="flex items-center justify-between border rounded-md p-3 gap-3 hover:bg-muted/50 transition-colors"
              >
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
                      <span className="bg-muted px-1.5 py-0.5 rounded text-xs">
                        {getFileExtension(fileProgress.file.name)}
                      </span>
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
                            {fileProgress.progress}%
                          </span>
                        </div>
                      )}
                      {fileProgress.error && (
                        <span className="text-xs text-red-500 truncate">
                          {fileProgress.error}
                        </span>
                      )}
                      {fileProgress.fileUrl &&
                        fileProgress.status === "completed" && (
                          <span
                            className="text-xs text-green-500 truncate"
                            title={fileProgress.fileUrl}
                          >
                            ✓ تم التخزين
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={(e) => handleRemoveFile(fileProgress.id, index, e)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploaderMultiple;
