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

interface FileUploaderMultipleProps {
  fileType: string;
  fileIds: number[];
  setFileIds: (ids: number[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  existingFiles?: ExistingFile[];
}

const FileUploaderMultiple = ({
  fileType,
  fileIds,
  setFileIds,
  maxFiles = 15,
  maxSizeMB = 200,
  accept = { "*/*": [] },
  existingFiles = [],
}: FileUploaderMultipleProps) => {
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslate();
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const MAX_FILE_SIZE_BYTES = maxSizeMB * 1024 * 1024;
  // ✅ Detect type from extension
  const getFileTypeFromExtension = (fileName: string): string => {
    console.log(fileName);
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
  console.log(existingFiles);
  // ✅ Initialize with existing files
  useEffect(() => {
    if (!existingFiles || existingFiles.length === 0) {
      setFileProgresses([]);
      return;
    }
    const existingFileProgresses: FileProgress[] = existingFiles.map((file) => {
       const fileType = getFileTypeFromExtension(file.image_name);

      return {
        id: `existing-${file.image_id}`,
        file: {
          image_id: file.image_id,
          url: file.url,
          image_name: file.image_name,
          type: fileType,
        },
        status: "existing",
        progress: 100,
        fileUrl: file.url,
        mediaId: file.image_id,
      };
    });

    setFileProgresses(existingFileProgresses);

    // ✅ Ensure fileIds contains all existing IDs
    const existingIds = existingFiles.map((f) => f.image_id);
    const uniqueIds = [...new Set([...fileIds, ...existingIds])];
    if (JSON.stringify(uniqueIds) !== JSON.stringify(fileIds)) {
      setFileIds(uniqueIds);
    }
  }, [existingFiles]);

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

  // ✅ Drop handler
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const currentFilesCount = fileProgresses.filter(
        (fp) => fp.status !== "existing"
      ).length;

      if (currentFilesCount + acceptedFiles.length > maxFiles) {
        toast.error(t(`يمكنك رفع حتى ${maxFiles} ملفات`));
        return;
      }

      const newFileProgresses: FileProgress[] = acceptedFiles.map((file) => ({
        id: `new-${Math.random().toString(36).substring(2, 9)}`,
        file: {
          image_name: file.name,
          size: file.size,
          type: getFileTypeFromExtension(file.name),
        },
        status: "pending",
        progress: 0,
      }));

      setFileProgresses((prev) => [...prev, ...newFileProgresses]);
      setIsProcessing(true);

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fp = newFileProgresses[i];
        const controller = new AbortController();
        abortControllers.current.set(fp.id, controller);

        try {
          setFileProgresses((prev) =>
            prev.map((p) =>
              p.id === fp.id ? { ...p, status: "uploading" } : p
            )
          );

          const { fileUrl, mediaId } = await uploadFile(
            file,
            fp.id,
            (progress) =>
              setFileProgresses((prev) =>
                prev.map((p) => (p.id === fp.id ? { ...p, progress } : p))
              ),
            controller.signal
          );

          setFileProgresses((prev) =>
            prev.map((p) =>
              p.id === fp.id
                ? { ...p, status: "completed", progress: 100, fileUrl, mediaId }
                : p
            )
          );

          setFileIds([...fileIds, mediaId]);
        } catch (e) {
          setFileProgresses((prev) =>
            prev.map((p) =>
              p.id === fp.id
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
          abortControllers.current.delete(fp.id);
        }
      }

      setIsProcessing(false);
    },
    [fileProgresses, fileIds, maxFiles, t, setFileIds, fileType]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize: MAX_FILE_SIZE_BYTES,
    accept,
    onDrop,
    disabled: isProcessing,
  });

  // ✅ Remove file
  const handleRemoveFile = (fileId: string, mediaId?: number) => {
    // Cancel upload if in progress
    const controller = abortControllers.current.get(fileId);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(fileId);
    }

    setFileProgresses((prev) => prev.filter((fp) => fp.id !== fileId));

    if (mediaId) {
      setFileIds(fileIds.filter((id) => id !== mediaId));
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
        <p className="mt-2">{t("اسحب وأسقط الملفات أو انقر للتصفح")}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t(`الحد الأقصى: ${maxFiles} ملفات، الحجم الأقصى: ${maxSizeMB}MB`)}
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

export default FileUploaderMultiple;
