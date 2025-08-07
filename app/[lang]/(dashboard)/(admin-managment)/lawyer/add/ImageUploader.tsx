"use client";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
import { RemoveImage } from "@/services/auth/auth";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface ImageUploaderProps {
  imageType:
    | "lawyer_licence"
    | "driving_licence"
    | "national_id_image"
    | "subscription_image"; // Restrict imageType to allowed literals
  id: File | null;
  onFileChange: (
    file: File,
    imageType:
      | "lawyer_licence"
      | "driving_licence"
      | "national_id_image"
      | "subscription_image"
  ) => Promise<void>;
}

const ImageUploader = ({ imageType, id, onFileChange }: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslate();
  const { lang } = useParams();
  const { toast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1, // Only allow 1 file per upload
    maxSize: 100 * 1024 * 1024, // 100 MB
    accept: {
      "*/*": [], // Accept all file types
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]; // We only allow one file per drop
      setFiles([file]);
      onFileChange(file, imageType); // Trigger the callback with the file and its type
    },
    onDropRejected: () => {
      toast({
        color: "destructive",
        title: "Error",
        description: "You can only upload 1 file & maximum size of 2 MB",
      });
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
      return <Icon icon="tabler:file-description" />;
    }
  };

  const handleRemoveFile = async (file: File, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent form submission or other event triggers

    setFiles([]); // Clear the file from state

    try {
      const res = await RemoveImage(id, lang); // Call API to remove the image
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

    // Do not call onFileChange here to avoid triggering handleImageChange
  };

  return (
    <Fragment>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="w-full text-center border-dashed border rounded-md py-4 flex items-center flex-col">
          <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-default-500" />
          </div>
          <h4 className="text-lg font-medium mb-1 text-card-foreground/80">
            {t("Drop image here or click to upload")}
          </h4>
        </div>
      </div>
      {files.length ? (
        <Fragment>
          <div className="flex justify-between items-center border px-3.5 py-3 my-6 rounded-md">
            <div className="flex space-x-3 items-center">
              <div className="file-preview">{renderFilePreview(files[0])}</div>
              <div>
                <div className="text-sm text-card-foreground">
                  {files[0].name}
                </div>
                <div className="text-xs font-light text-muted-foreground">
                  {Math.round(files[0].size / 100) / 10 > 1000
                    ? `${(Math.round(files[0].size / 100) / 10000).toFixed(
                        1
                      )} MB`
                    : `${(Math.round(files[0].size / 100) / 10).toFixed(1)} KB`}
                </div>
              </div>
            </div>
            <Button
              size="icon"
              color="destructive"
              variant="outline"
              className="border-none rounded-full"
              onClick={(e) => handleRemoveFile(files[0], e)}
            >
              <Icon icon="tabler:x" className="h-5 w-5" />
            </Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default ImageUploader;
