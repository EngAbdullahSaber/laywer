"use client";
import { Fragment, useState } from "react";
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
  imageType: "files";

  id: File | null;
  onFileChange: (file: File, imageType: "files") => Promise<void>;
}
// Define accepted file types (image formats and common file formats)
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

  // UseDropzone hook configuration for multiple files
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5, // You can upload up to 5 files
    maxSize: 2000000, // 2 MB max size for each file
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Add new files to the array
      acceptedFiles.forEach((file) => onFileChange(file, imageType)); // Trigger the callback for each file
    },
    onDropRejected: () => {
      toast({
        color: "destructive",
        title: "Error",
        description: "You can only upload 5 files & maximum size of 2 MB each",
      });
    },
  });

  // Render a preview for images and generic file icons for other types
  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image")) {
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
      return <Icon icon="tabler:file-description" className="h-6 w-6" />;
    }
  };

  // Handle removal of individual files
  const handleRemoveFile = async (file: File, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent form submission or other event triggers

    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name)); // Remove the specific file from the state

    try {
      const res = await RemoveImage(id, lang); // Call API to remove the image (adjust if needed)
      if (res) {
        reToast.success(res.message);
      } else {
        reToast.error(t("Failed to remove image"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";
      reToast.error(errorMessage);
    }
  };

  // Format file size into human-readable format (KB or MB)
  const formatFileSize = (size: number) => {
    const fileSizeInKB = size / 1024;
    if (fileSizeInKB > 1024) {
      return `${(fileSizeInKB / 1024).toFixed(2)} MB`;
    } else {
      return `${fileSizeInKB.toFixed(1)} KB`;
    }
  };

  // Render file list with previews and remove functionality
  const fileList = files.map((file) => (
    <div
      key={file.name}
      className="flex justify-between border px-3.5 py-3 my-6 w-[45%] h-24 rounded-md"
    >
      <div className="flex space-x-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className="text-sm text-card-foreground">{file.name}</div>
          <div className="text-xs font-light text-muted-foreground">
            {formatFileSize(file.size)}
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
  ));

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
              className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
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

      {/* Display the uploaded files */}
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
