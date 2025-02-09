"use client";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";

// Define accepted file types (image formats and common file formats)
const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FileUploaderMultiple = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslate();

  // UseDropzone hook configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes, // Accept images and common document types
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => Object.assign(file)),
      ]);
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
  const handleRemoveFile = (file: File) => {
    setFiles(files.filter((f) => f.name !== file.name));
  };

  // Handle removing all files
  const handleRemoveAllFiles = () => {
    setFiles([]);
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
        onClick={() => handleRemoveFile(file)}
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
          <div className="mt-4 flex flex-row justify-between items-center w-full">
            {fileList}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
