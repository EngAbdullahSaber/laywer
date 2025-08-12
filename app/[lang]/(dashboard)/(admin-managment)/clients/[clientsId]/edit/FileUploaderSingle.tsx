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
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface ImageUploaderProps {
  imageType: "client_files";
  id: File[] | null;
  onFileChange: (file: File, imageType: "client_files") => Promise<void>;
}

const MAX_FILE_SIZE_MB = 200; // 15MB max file size
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
        toast.error(
          t(`الحد الأقصى لحجم الملف هو ${MAX_FILE_SIZE_MB} ميجابايت`)
        );
        return;
      }

      const file = acceptedFiles[0];
      setFiles((prevFiles) => [...prevFiles, file]);
      onFileChange(file, imageType);
    },
    onDropRejected: (fileRejections) => {
      const hasTooManyFiles = fileRejections.some((rejection) =>
        rejection.errors.some((e) => e.code === "too-many-files")
      );

      if (hasTooManyFiles) {
        toast.error(t("يمكنك رفع حتى 5 ملفات في المرة الواحدة"));
      } else {
        toast.error(
          t(
            `الرجاء التحقق من أنواع الملفات وأحجامها (الحد الأقصى ${MAX_FILE_SIZE_MB} ميجابايت لكل ملف)`
          )
        );
      }
    },
  });

  useEffect(() => {
    if (id) {
      setFiles(id);
    }
  }, [id]);

  const renderFilePreview = (file: File) => {
    if (file?.type?.startsWith("image")) {
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

  const handleRemoveFile = async (file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

    try {
      if (Array.isArray(id)) {
        for (const image of id) {
          const res = await RemoveImage(image.image_id || image.id, lang);
          if (res) {
            toast.success(res.message);
          } else {
            toast.error(t("فشل في حذف الملف"));
          }
        }
      } else {
        const res = await RemoveImage(id?.[0]?.image_id || id?.[0]?.id, lang);
        if (res) {
          toast.success(res.message);
        } else {
          toast.error(t("فشل في حذف الملف"));
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(t("حدث خطأ ما"));
    }
  };

  const formatFileSize = (size: number) => {
    const fileSizeInKB = size / 1024;
    if (fileSizeInKB > 1024) {
      return `${(fileSizeInKB / 1024).toFixed(2)} ميجابايت`;
    } else {
      return `${fileSizeInKB.toFixed(1)} كيلوبايت`;
    }
  };

  return (
    <Fragment>
      <div className="mb-2 text-sm text-muted-foreground">
        (الملفات كبيرة الحجم سوف تاخذ وقت){t("الحد الأقصى لحجم الملف:")}{" "}
        {MAX_FILE_SIZE_MB} ميجابايت
      </div>

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
                {t("اختر ملف")}
                <Upload className="mx-2 h-4 w-4" />
              </div>
            </Button>
          </div>
        </Label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((file, index) => (
            <div
              key={file.name || index}
              className="flex justify-between items-center border px-3.5 py-3 rounded-md"
            >
              <div className="flex space-x-3 items-center">
                <div className="file-preview">{renderFilePreview(file)}</div>
                <div>
                  <div className="text-sm text-card-foreground">
                    {file.name || file.image_name}
                  </div>
                  {file.size && (
                    <div className="text-xs font-light text-muted-foreground">
                      {formatFileSize(file.size)}
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
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
