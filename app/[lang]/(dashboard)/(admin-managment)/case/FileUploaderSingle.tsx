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
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface ImageUploaderProps {
  imageType: "order_files";
  id: File | null;
  onFileChange: (file: File, imageType: "order_files") => Promise<void>;
}

const MAX_FILE_SIZE_MB = 15; // 15MB max file size
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUploaderMultiple = ({
  imageType,
  id,
  onFileChange,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslate();
  const { lang } = useParams();

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE_BYTES,
    accept: {
      "*/*": [],
    },
    onDrop: (acceptedFiles, fileRejections) => {
      // Check for size rejections
      const sizeRejections = fileRejections.filter((rejection) =>
        rejection.errors.some((e) => e.code === "file-too-large")
      );

      if (sizeRejections.length > 0) {
        toast.error(t(`Maximum file size is ${MAX_FILE_SIZE_MB}MB`));
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      acceptedFiles.forEach((file) => onFileChange(file, imageType));

      toast.success(t(`${acceptedFiles.length} file(s) uploaded successfully`));
    },
    onDropRejected: (fileRejections) => {
      const hasTooManyFiles = fileRejections.some((rejection) =>
        rejection.errors.some((e) => e.code === "too-many-files")
      );

      if (hasTooManyFiles) {
        toast.error(t("You can upload up to 5 files at once"));
      } else {
        toast.error(
          t(
            `Please check file types and sizes (max ${MAX_FILE_SIZE_MB}MB each)`
          )
        );
      }
    },
  });

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

  const handleRemoveFile = async (file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

    try {
      const res = await RemoveImage(id, lang);
      if (res) {
        toast.success(res.message);
      } else {
        toast.error(t("Failed to remove file"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = t("Something went wrong.");
      toast.error(errorMessage);
    }
  };

  const formatFileSize = (size: number) => {
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${size} bytes`;
  };

  const fileList = files.map((file) => (
    <div
      key={file.name}
      className="flex justify-between border px-3.5 py-3 my-6 w-[45%] h-24 rounded-md"
    >
      <div className="flex space-x-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className="text-sm text-card-foreground truncate max-w-[180px]">
            {file.name}
          </div>
          <div className="text-xs font-light text-muted-foreground">
            {formatFileSize(file.size)}
          </div>
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
      <div className="mb-2 text-sm text-muted-foreground">
        {t("Maximum file size:")} {MAX_FILE_SIZE_MB}MB
      </div>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Label>
          <div>
            <Button
              asChild
              className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] hover:text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
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
