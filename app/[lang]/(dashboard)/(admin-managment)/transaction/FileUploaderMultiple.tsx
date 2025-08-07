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
import { C } from "@fullcalendar/core/internal-common";

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
  }, []);
  console.log(existingFiles);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: 100 * 1024 * 1024, // 100 MB
    accept: {
      "*/*": [],
    },
    onDrop: async (acceptedFiles) => {
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

      setFiles((prev) => [...prev, ...compressedFiles]);
      onFileChange([...files, ...compressedFiles]);
    },
    onDropRejected: () => {
      toast({
        color: "destructive",
        title: "Error",
        description:
          "You can only upload 5 files & maximum size of 100 MB each",
      });
    },
  });
  console.log(files);
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
    setFiles((prev) => prev.filter((f) => f.url !== file.url));
    onFileChange(files.filter((f) => f.url !== file.url));

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
    const fileSizeInKB = size / 1024;
    if (fileSizeInKB > 1024) {
      return `${(fileSizeInKB / 1024).toFixed(2)} MB`;
    } else {
      return `${fileSizeInKB.toFixed(1)} KB`;
    }
  };

  const fileList = files.map((file) => (
    <div
      key={file.url}
      className="flex justify-between border px-3.5 py-3 my-6 w-[45%] h-24 rounded-md"
    >
      <div className="flex space-x-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className="text-sm text-card-foreground">{file.image_name}</div>
          {file.file && (
            <div className="text-xs font-light text-muted-foreground">
              {formatFileSize(file.file.size)}
            </div>
          )}
        </div>
      </div>
      <Button
        size="icon"
        color="destructive"
        variant="outline"
        className="border-none rounded-full"
        onClick={(e) => handleRemoveFile(file, e)}
      >
        <Icon icon="tabler:x" className="h-5 w-5" />
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
              color="info"
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
        </div>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
