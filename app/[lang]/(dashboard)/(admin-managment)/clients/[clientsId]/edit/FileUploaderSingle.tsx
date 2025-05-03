"use client";
import { Fragment, useEffect, useState } from "react";
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

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface ImageUploaderProps {
  imageType: "client_files";
  // Restrict imageType to allowed literals
  id: File[] | null; // Allow `id` to be an array of files or null
  onFileChange: (file: File, imageType: "client_files") => Promise<void>;
}

const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FileUploaderMultiple = ({
  imageType,
  id,
  onFileChange,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]); // Keep track of multiple files
  const { t } = useTranslate();
  const { lang } = useParams();
  const { toast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: 2000000, // 2 MB max size for each file
    accept: {
      "*/*": [], // Accept all file types
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]; // We only allow one file per drop
      setFiles((prevFiles) => [...prevFiles, file]); // Add new file to the list
      onFileChange(file, imageType); // Trigger the callback with the file and its type
    },
    onDropRejected: () => {
      toast({
        color: "destructive",
        title: "Error",
        description: "You can only upload 5 files & maximum size of 2 MB each",
      });
    },
  });

  useEffect(() => {
    if (id) {
      setFiles(id); // If `id` is an array, set files from `id`
    }
  }, [id]);

  const renderFilePreview = (file: File) => {
    if (file && file?.type?.startsWith("image")) {
      return (
        <Image
          width={48}
          height={48}
          alt={file.name}
          src={URL.createObjectURL(file)}
          className="rounded border p-0.5"
        />
      );
    } else {
      return <Icon icon="tabler:file-description" />;
    }
  };

  // Handle removal of individual files
  const handleRemoveFile = async (file: File, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent form submission or other event triggers

    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name)); // Remove specific file from the state

    try {
      if (Array.isArray(id)) {
        // Loop through all file objects in the array and remove each
        for (const image of id) {
          const res = await RemoveImage(image.image_id || image.id, lang);
          if (res) {
            reToast.success(res.message);
          } else {
            reToast.error(t("Failed to remove image"));
          }
        }
      } else {
        // If `id` is a single file (or null), remove it
        const res = await RemoveImage(id[0]?.image_id || id[0]?.id, lang);
        if (res) {
          reToast.success(res.message);
        } else {
          reToast.error(t("Failed to remove image"));
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";
      reToast.error(errorMessage);
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

  return (
    <Fragment>
      {/* Dropzone area where users can drop files or click to choose files */}
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Label>
          <div>
            <Button
              asChild
              color="info"
              className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] text-[#fff] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] "
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

      {files.length ? (
        <Fragment>
          {files.map((file, index) => (
            <div
              key={file.name || index}
              className="flex justify-between items-center border px-3.5 py-3 my-6 rounded-md"
            >
              <div className="flex space-x-3 items-center">
                <div className="file-preview">{renderFilePreview(file)}</div>
                <div>
                  <div className="text-sm text-card-foreground">
                    {file.name || file.image_name}
                  </div>
                  <div className="text-xs font-light text-muted-foreground">
                    {file.name ? formatFileSize(file.size) : null}
                  </div>
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
          ))}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default FileUploaderMultiple;
