"use client";
import { Fragment, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { RemoveImage } from "@/services/auth/auth";
import { AxiosError } from "axios";
import { toast as reToast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import imageCompression from "browser-image-compression";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface FileData {
  image_id?: number;
  url: string;
  image_name: string;
  file?: File;
}

interface ImageUploaderProps {
  imageType: "files";
  existingFiles?: FileData[];
  onFileChange: (files: FileData[]) => Promise<void>;
}

const MAX_FILE_SIZE_MB = 200; // 15MB max file size
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUploaderMultiple = ({
  imageType,
  existingFiles = [],
  onFileChange,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<FileData[]>(existingFiles);
  const { t } = useTranslate();
  const { lang } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE_BYTES,
    accept: {
      "*/*": [],
    },
    onDrop: async (acceptedFiles, fileRejections) => {
      // Check for size rejections first
      const sizeRejections = fileRejections.filter((rejection) =>
        rejection.errors.some((e) => e.code === "file-too-large")
      );

      if (sizeRejections.length > 0) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `Maximum file size is ${MAX_FILE_SIZE_MB}MB`,
        });
        return;
      }

      const compressedFiles: FileData[] = [];

      for (const file of acceptedFiles) {
        let finalFile = file;

        // Compress only if it's an image
        if (file.type.startsWith("image/")) {
          try {
            const options = {
              maxSizeMB: 1, // Target max size ~1MB
              maxWidthOrHeight: 1920, // Resize if larger
              useWebWorker: true,
            };
            finalFile = await imageCompression(file, options);
          } catch (error) {
            console.error("Compression failed:", error);
          }
        }

        compressedFiles.push({
          url: URL.createObjectURL(finalFile),
          image_name: finalFile.name,
          file: finalFile,
        });
      }

      const updatedFiles = [...files, ...compressedFiles].slice(0, 5); // Ensure max 5 files
      setFiles(updatedFiles);
      await onFileChange(updatedFiles);

      toast({
        variant: "default",
        title: "Files added",
        description: `${compressedFiles.length} file(s) uploaded successfully`,
      });
    },
    onDropRejected: (fileRejections) => {
      const hasTooManyFiles = fileRejections.some((rejection) =>
        rejection.errors.some((e) => e.code === "too-many-files")
      );

      if (hasTooManyFiles) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: "You can upload up to 5 files at once",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: `Please check file types and sizes (max ${MAX_FILE_SIZE_MB}MB each)`,
        });
      }
    },
  });

  const renderFilePreview = (file: FileData) => {
    if (file.url.match(/\.(jpeg|jpg|png|gif)$/)) {
      return (
        <Image
          width={48}
          height={48}
          alt={file.image_name}
          src={file.url}
          className="rounded border p-0.5"
        />
      );
    } else {
      return <Icon icon="tabler:file-description" className="h-6 w-6" />;
    }
  };

  const handleRemoveFile = async (file: FileData, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFiles = files.filter((f) => f.url !== file.url);
    setFiles(updatedFiles);
    await onFileChange(updatedFiles);

    if (file.image_id) {
      try {
        const res = await RemoveImage(file.image_id, lang);
        if (res) {
          reToast.success(res.message);
        } else {
          reToast.error(t("Failed to remove file"));
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        let errorMessage = "Something went wrong.";
        reToast.error(errorMessage);
      }
    }
  };

  const formatFileSize = (size: number) => {
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${size} bytes`;
  };

  const fileList = files.map((file) => (
    <div
      key={file.url}
      className="flex justify-between border px-3.5 py-3 my-6 w-[45%] h-24 rounded-md"
    >
      <div className="flex space-x-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className="text-sm text-card-foreground truncate max-w-[180px]">
            {file.image_name}
          </div>
          {file.file && (
            <div className="text-xs font-light text-muted-foreground">
              {formatFileSize(file.file.size)}
            </div>
          )}
        </div>
      </div>
      <Button
        size="icon"
        variant="outline"
        className="border-none rounded-full hover:bg-destructive/10"
        onClick={(e) => handleRemoveFile(file, e)}
      >
        <Icon icon="tabler:x" className="h-5 w-5 text-destructive" />
      </Button>
    </div>
  ));

  return (
    <Fragment>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Label>
          <div>
            <Button
              asChild
              className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d]"
              variant="outline"
            >
              <div>
                {t("Choose File")}
                <Upload className="mx-2 h-4 w-4" />
              </div>
            </Button>
          </div>
        </Label>
      </div>

      {files.length > 0 && (
        <div>
          <div className="mt-4 flex flex-wrap justify-between items-center w-full">
            {fileList}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Maximum file size: {MAX_FILE_SIZE_MB}MB per file
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
