"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { UpdateLawyer, getSpecifiedLawyer } from "@/services/lawyer/lawyer";
import { getCategory } from "@/services/category/category";
import CreateLawyerCategory from "@/app/[lang]/(dashboard)/(category-mangement)/lawyer-category/CreateLawyerCategory";
import { CleaveInput } from "@/components/ui/cleave";
import { useRouter } from "next/navigation";
import FileUploaderSingle from "./FileUploaderSingle";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface ExistingFile {
  image_id: number;
  url: string;
  image_name: string;
}
interface LaywerData {
  name: string;
  phone: string;
  driving_licence_number: string;
  email: string;
  address: string;
  category_id: string;
  status: string;
}

const Form = () => {
  const [category, setCategory] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);
  const [lawyerData, setLawyerData] = useState<LaywerData>({
    name: "",
    phone: "",
    driving_licence_number: "",
    email: "",
    address: "",
    category_id: "",
    status: "active",
  });
  const [data, setData] = useState<any>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const router = useRouter();

  const { lang, lawyerId } = useParams();
  const [loading, setLoading] = useState(true);

  // File states - use arrays as expected by FileUploaderSingle
  const [fileIdsDrivingLicence, setFileIdsDrivingLicence] = useState<number[]>(
    []
  );
  const [existingFilesDrivingLicence, setExistingFilesDrivingLicence] =
    useState<ExistingFile[]>([]);

  const [fileIdsLawyerLicence, setFileIdsLawyerLicence] = useState<number[]>(
    []
  );
  const [existingFilesLawyerLicence, setExistingFilesLawyerLicence] = useState<
    ExistingFile[]
  >([]);

  const [fileIdsSubscriptionImage, setFileIdsSubscriptionImage] = useState<
    number[]
  >([]);
  const [existingFilesSubscriptionImage, setExistingFilesSubscriptionImage] =
    useState<ExistingFile[]>([]);

  const [fileIdsNationalIdImage, setFileIdsNationalIdImage] = useState<
    number[]
  >([]);
  const [existingFilesNationalIdImage, setExistingFilesNationalIdImage] =
    useState<ExistingFile[]>([]);

  // Helper function to create file setters that sync both fileIds and existingFiles
  const createFileSetters = (fileType: keyof typeof fileIds) => {
    const setters = {
      driving_licence: {
        setFileIds: setFileIdsDrivingLicence,
        setExistingFiles: setExistingFilesDrivingLicence,
      },
      lawyer_licence: {
        setFileIds: setFileIdsLawyerLicence,
        setExistingFiles: setExistingFilesLawyerLicence,
      },
      subscription_image: {
        setFileIds: setFileIdsSubscriptionImage,
        setExistingFiles: setExistingFilesSubscriptionImage,
      },
      national_id_image: {
        setFileIds: setFileIdsNationalIdImage,
        setExistingFiles: setExistingFilesNationalIdImage,
      },
    };

    return {
      setFileIds: (ids: number[]) => {
        setters[fileType].setFileIds(ids);
        // When fileIds change, also update existingFiles to reflect the new state
        if (ids.length > 0) {
          // Create a dummy existing file object for the new file
          const newExistingFile: ExistingFile = {
            image_id: ids[0],
            url: "", // This will be empty for new files until we have the actual URL
            image_name: `uploaded-file-${ids[0]}`,
          };
          setters[fileType].setExistingFiles([newExistingFile]);
        } else {
          setters[fileType].setExistingFiles([]);
        }
      },
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Iterate over all lawyerData fields to dynamically create query params
    Object.entries(lawyerData).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    // Append images - take the first ID from each array
    if (fileIdsNationalIdImage.length > 0) {
      params.append("national_id_image", fileIdsNationalIdImage[0].toString());
    }
    if (fileIdsDrivingLicence.length > 0) {
      params.append("driving_licence", fileIdsDrivingLicence[0].toString());
    }
    if (fileIdsSubscriptionImage.length > 0) {
      params.append(
        "subscription_image",
        fileIdsSubscriptionImage[0].toString()
      );
    }
    if (fileIdsLawyerLicence.length > 0) {
      params.append("lawyer_licence", fileIdsLawyerLicence[0].toString());
    }

    return params.toString();
  };

  const getLawyerData = async () => {
    try {
      const res = await getSpecifiedLawyer(lang, lawyerId);
      if (res?.body["0"]) {
        const lawyer = res.body["0"];

        setLawyerData({
          name: lawyer?.name,
          phone: lawyer?.phone,
          driving_licence_number: lawyer?.driving_licence_number,
          email: lawyer?.email,
          address: lawyer?.address,
          category_id: lawyer?.category.id,
          status: lawyer?.status,
        });

        // Store the full file objects from API response as arrays
        setExistingFilesNationalIdImage(
          lawyer?.national_id_image ? [lawyer.national_id_image] : []
        );
        setExistingFilesSubscriptionImage(
          lawyer?.subscription_image ? [lawyer.subscription_image] : []
        );
        setExistingFilesLawyerLicence(
          lawyer?.lawyer_licence ? [lawyer.lawyer_licence] : []
        );
        setExistingFilesDrivingLicence(
          lawyer?.driving_licence ? [lawyer.driving_licence] : []
        );

        // Set file IDs
        setFileIdsNationalIdImage(
          lawyer?.national_id_image?.image_id
            ? [lawyer.national_id_image.image_id]
            : []
        );
        setFileIdsSubscriptionImage(
          lawyer?.subscription_image?.image_id
            ? [lawyer.subscription_image.image_id]
            : []
        );
        setFileIdsLawyerLicence(
          lawyer?.lawyer_licence?.image_id
            ? [lawyer.lawyer_licence.image_id]
            : []
        );
        setFileIdsDrivingLicence(
          lawyer?.driving_licence?.image_id
            ? [lawyer.driving_licence.image_id]
            : []
        );
      }
    } catch (error) {
      console.error("Error fetching lawyer data", error);
    }
  };

  const handleSelectChange = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);

    const formData = new FormData();
    const queryParams = buildQueryParams();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append images - take the first ID from each array
    if (fileIdsNationalIdImage.length > 0) {
      formData.append(
        "national_id_image",
        fileIdsNationalIdImage[0].toString()
      );
    }
    if (fileIdsDrivingLicence.length > 0) {
      formData.append("driving_licence", fileIdsDrivingLicence[0].toString());
    }
    if (fileIdsSubscriptionImage.length > 0) {
      formData.append(
        "subscription_image",
        fileIdsSubscriptionImage[0].toString()
      );
    }
    if (fileIdsLawyerLicence.length > 0) {
      formData.append("lawyer_licence", fileIdsLawyerLicence[0].toString());
    }

    try {
      const res = await UpdateLawyer(queryParams, lawyerId, lang);
      if (res) {
        setLoading(true);
        reToast.success(res.message);
        // Refresh data to get updated file URLs
        router.back();
      } else {
        reToast.error(t("Failed to update Lawyer"));
        setLoading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";

      const fields = [
        "name",
        "phone",
        "driving_licence_number",
        "category_id",
        "address",
        "email",
        "lawyer_licence",
        "national_id_image",
        "driving_licence",
        "subscription_image",
      ];

      for (let field of fields) {
        const error = axiosError.response?.data?.errors?.[field];
        if (error) {
          errorMessage = error[0];
          break;
        }
      }

      reToast.error(errorMessage);
      setLoading(true);
    }
  };

  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));

  const fetchData = async () => {
    try {
      const countriesData = await getCategory("lawyer", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    getLawyerData();
    fetchData();
  }, [lang, lawyerId, flag]);

  const { t } = useTranslate();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Update Lawyer")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between ">
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Lawyer Info")}
            </motion.p>
            <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Name">{t("Lawyer Name")}</Label>
                <Input
                  type="text"
                  name="name"
                  value={lawyerData.name}
                  placeholder={t("Enter Lawyer Name")}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="phone">{t("Mobile Number")}</Label>
                <CleaveInput
                  id="phone"
                  options={{
                    prefix: "+966",
                    delimiter: " ",
                    blocks: [4, 2, 3, 4],
                    numericOnly: true,
                    uppercase: true,
                  }}
                  type="tel"
                  name="phone"
                  value={
                    lawyerData.phone.startsWith("+966")
                      ? lawyerData.phone
                      : `+966 ${lawyerData.phone.replace(/^966/, "")}`
                  }
                  placeholder={t("Enter Mobile Number")}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Licence">{t("Licence Number")}</Label>
                <Input
                  type="number"
                  name="driving_licence_number"
                  value={lawyerData.driving_licence_number}
                  onChange={handleInputChange}
                  placeholder={t("Enter Licence Number")}
                />
              </motion.div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="Court_Category">
                      {t("Lawyer Category")}
                    </Label>
                    <BasicSelect
                      menu={transformedCategories}
                      setSelectedValue={(value) => handleSelectChange(value)}
                      selectedValue={lawyerData["category_id"]}
                    />
                  </div>
                  <div className="w-[8%] mt-5">
                    <CreateLawyerCategory
                      buttonShape={false}
                      setFlag={setFlag}
                      flag={flag}
                    />
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Address">{t("Address")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Address")}
                  name="address"
                  value={lawyerData.address}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  type="email"
                  placeholder={t("Enter Email")}
                  name="email"
                  value={lawyerData.email}
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="my-3"
            />
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Upload Files")}
            </motion.p>
            <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label>{t("Licensing photo")}</Label>
                <FileUploaderSingle
                  fileType="driving_licence"
                  fileIds={fileIdsDrivingLicence}
                  setFileIds={createFileSetters("driving_licence").setFileIds}
                  existingFiles={existingFilesDrivingLicence}
                  maxFiles={1}
                  maxSizeMB={100}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </motion.div>

              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.3 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label>{t("licence photo")}</Label>
                <FileUploaderSingle
                  fileType="lawyer_licence"
                  fileIds={fileIdsLawyerLicence}
                  setFileIds={createFileSetters("lawyer_licence").setFileIds}
                  existingFiles={existingFilesLawyerLicence}
                  maxFiles={1}
                  maxSizeMB={100}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </motion.div>

              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.4 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label>{t("Membership photo")}</Label>
                <FileUploaderSingle
                  fileType="subscription_image"
                  fileIds={fileIdsSubscriptionImage}
                  setFileIds={
                    createFileSetters("subscription_image").setFileIds
                  }
                  existingFiles={existingFilesSubscriptionImage}
                  maxFiles={1}
                  maxSizeMB={100}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </motion.div>

              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.5 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label>{t("ID photo")}</Label>
                <FileUploaderSingle
                  fileType="national_id_image"
                  fileIds={fileIdsNationalIdImage}
                  setFileIds={createFileSetters("national_id_image").setFileIds}
                  existingFiles={existingFilesNationalIdImage}
                  maxFiles={1}
                  maxSizeMB={100}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                disabled={!loading}
                onClick={handleSubmit}
                className="w-40 !bg-[#dfc77d] px-2 hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Update Lawyer")}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
