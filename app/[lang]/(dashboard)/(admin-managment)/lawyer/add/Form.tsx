"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { motion } from "framer-motion";
import { toast as reToast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateLawyerCategory from "../../../(category-mangement)/lawyer-category/CreateLawyerCategory";
import { getCategory } from "@/services/category/category";
import { AxiosError } from "axios";
import { CreateLawyer } from "@/services/lawyer/lawyer";
import { CleaveInput } from "@/components/ui/cleave";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploaderSingle from "./ImageUploader";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface LawyerData {
  name: string;
  phone: string;
  driving_licence_number: string;
  email: string;
  address: string;
  category_id: string;
  status: string;
}

interface FormProps {
  asDialog?: boolean;
  dialogTrigger?: React.ReactNode;
  onSuccess?: () => void;
}

// Animation variants for consistent animations
const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Form content component with animations (for standalone form)
const FormContentWithAnimations = React.memo(
  ({
    lawyerData,
    handleInputChange,
    handleSelectChange,
    handleFileIdChange,
    handleSubmit,
    loading,
    t,
    transformedCategories,
    setFlag,
    flag,
    fileIds,
  }: any) => (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create a New Lawyer")}</CardTitle>
        </CardHeader>
        <ScrollArea>
          <CardContent>
            <motion.div
              variants={staggerChildren}
              initial="initial"
              animate="animate"
              className="flex flex-col justify-between"
            >
              <motion.p variants={fadeInUp} className="my-4 font-bold">
                {t("Lawyer Info")}
              </motion.p>
              <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label htmlFor="Name">{t("Lawyer Name")}</Label>
                  <Input
                    type="text"
                    placeholder={t("Enter Lawyer Name")}
                    name="name"
                    value={lawyerData.name}
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
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
                    value={lawyerData.phone}
                    type="tel"
                    name="phone"
                    placeholder={t("Enter Mobile Number")}
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label htmlFor="Licence">{t("Licence Number")}</Label>
                  <Input
                    value={lawyerData.driving_licence_number}
                    type="number"
                    name="driving_licence_number"
                    onChange={handleInputChange}
                    placeholder={t("Enter Licence Number")}
                  />
                </motion.div>
                <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-row justify-between items-center"
                  >
                    <div className="!w-[87%]" style={{ width: "87%" }}>
                      <Label htmlFor="Court_Category">
                        {t("Lawyer Category")}
                      </Label>
                      <BasicSelect
                        menu={transformedCategories}
                        setSelectedValue={handleSelectChange}
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
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label htmlFor="Address">{t("Address")}</Label>
                  <Input
                    type="text"
                    placeholder={t("Enter Address")}
                    value={lawyerData.address}
                    name="address"
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label htmlFor="email">{t("Email")}</Label>
                  <Input
                    type="email"
                    placeholder={t("Enter Email")}
                    value={lawyerData.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                </motion.div>
              </div>
              <motion.hr variants={fadeInUp} className="my-3" />
              <motion.p variants={fadeInUp} className="my-4 font-bold">
                {t("Upload Files")}
              </motion.p>
              <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("Licensing photo")}</Label>
                  <FileUploaderSingle
                    fileType="driving_licence"
                    fileId={fileIds.driving_licence}
                    setFileId={(id) =>
                      handleFileIdChange(id, "driving_licence")
                    }
                    maxSizeMB={10}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("licence photo")}</Label>
                  <FileUploaderSingle
                    fileType="lawyer_licence"
                    fileId={fileIds.lawyer_licence}
                    setFileId={(id) => handleFileIdChange(id, "lawyer_licence")}
                    maxSizeMB={10}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("Membership photo")}</Label>
                  <FileUploaderSingle
                    fileType="subscription_image"
                    fileId={fileIds.subscription_image}
                    setFileId={(id) =>
                      handleFileIdChange(id, "subscription_image")
                    }
                    maxSizeMB={10}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("ID photo")}</Label>
                  <FileUploaderSingle
                    fileType="national_id_image"
                    fileId={fileIds.national_id_image}
                    setFileId={(id) =>
                      handleFileIdChange(id, "national_id_image")
                    }
                    maxSizeMB={10}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                  />
                </motion.div>
              </div>
              <motion.div
                variants={fadeInUp}
                className="flex justify-center gap-3 mt-4"
              >
                <Button
                  type="button"
                  disabled={!loading}
                  onClick={handleSubmit}
                  className="w-32 !bg-[#dfc77d] px-2 hover:!bg-[#fef0be] text-black"
                >
                  {loading ? t("Create Lawyer") : t("Loading")}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
);

FormContentWithAnimations.displayName = "FormContentWithAnimations";

// Form content component without animations (for dialog)
const FormContentWithoutAnimations = React.memo(
  ({
    lawyerData,
    handleInputChange,
    handleSelectChange,
    handleFileIdChange,
    handleSubmit,
    loading,
    t,
    transformedCategories,
    setFlag,
    flag,
    fileIds,
  }: any) => (
    <div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{t("Create a New Lawyer")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between">
            <p className="my-4 font-bold">{t("Lawyer Info")}</p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Name">{t("Lawyer Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Lawyer Name")}
                  name="name"
                  value={lawyerData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
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
                  value={lawyerData.phone}
                  type="tel"
                  name="phone"
                  placeholder={t("Enter Mobile Number")}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Licence">{t("Licence Number")}</Label>
                <Input
                  value={lawyerData.driving_licence_number}
                  type="number"
                  name="driving_licence_number"
                  onChange={handleInputChange}
                  placeholder={t("Enter Licence Number")}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="Court_Category">
                      {t("Lawyer Category")}
                    </Label>
                    <BasicSelect
                      menu={transformedCategories}
                      setSelectedValue={handleSelectChange}
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
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Address">{t("Address")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Address")}
                  value={lawyerData.address}
                  name="address"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  type="email"
                  placeholder={t("Enter Email")}
                  value={lawyerData.email}
                  name="email"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <hr className="my-3" />
            <p className="my-4 font-bold">{t("Upload Files")}</p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("Licensing photo")}</Label>
                <FileUploaderSingle
                  fileType="driving_licence"
                  fileId={fileIds.driving_licence}
                  setFileId={(id) => handleFileIdChange(id, "driving_licence")}
                  maxSizeMB={10}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("licence photo")}</Label>
                <FileUploaderSingle
                  fileType="lawyer_licence"
                  fileId={fileIds.lawyer_licence}
                  setFileId={(id) => handleFileIdChange(id, "lawyer_licence")}
                  maxSizeMB={10}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("Membership photo")}</Label>
                <FileUploaderSingle
                  fileType="subscription_image"
                  fileId={fileIds.subscription_image}
                  setFileId={(id) =>
                    handleFileIdChange(id, "subscription_image")
                  }
                  maxSizeMB={10}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("ID photo")}</Label>
                <FileUploaderSingle
                  fileType="national_id_image"
                  fileId={fileIds.national_id_image}
                  setFileId={(id) =>
                    handleFileIdChange(id, "national_id_image")
                  }
                  maxSizeMB={10}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <Button
                type="button"
                disabled={!loading}
                onClick={handleSubmit}
                className="w-32 !bg-[#dfc77d] px-2 hover:!bg-[#fef0be] text-black"
              >
                {loading ? t("Create Lawyer") : t("Loading")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
);

FormContentWithoutAnimations.displayName = "FormContentWithoutAnimations";

const LawyerForm = ({
  asDialog = false,
  dialogTrigger,
  onSuccess,
}: FormProps) => {
  const [category, setCategory] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [lawyerData, setLawyerData] = useState<LawyerData>({
    name: "",
    phone: "",
    driving_licence_number: "",
    email: "",
    address: "",
    category_id: "",
    status: "active",
  });

  const { lang } = useParams();
  const { t } = useTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [fileIds, setFileIds] = useState<{
    lawyer_licence: number | null;
    driving_licence: number | null;
    national_id_image: number | null;
    subscription_image: number | null;
  }>({
    lawyer_licence: null,
    driving_licence: null,
    national_id_image: null,
    subscription_image: null,
  });

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLawyerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  // Handle select change
  const handleSelectChange = useCallback((value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  }, []);

  // Handle file ID change
  const handleFileIdChange = useCallback(
    async (fileId: number | null, fileType: keyof typeof fileIds) => {
      setFileIds((prev) => ({
        ...prev,
        [fileType]: fileId,
      }));
    },
    []
  );

  const generateStrongPassword = useCallback((): string => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    // Get one character from each required category (4 characters)
    const requiredChars = [
      lowercase[Math.floor(Math.random() * lowercase.length)],
      uppercase[Math.floor(Math.random() * uppercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    // Get 4 more random characters from any category
    const allChars = lowercase + uppercase + numbers + symbols;
    const randomChars = Array.from(
      { length: 4 },
      () => allChars[Math.floor(Math.random() * allChars.length)]
    );

    // Combine and shuffle
    return [...requiredChars, ...randomChars]
      .sort(() => Math.random() - 0.5)
      .join("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(false);

      const formData = new FormData();

      // Append file IDs if they exist
      if (fileIds.national_id_image) {
        formData.append(
          "national_id_image",
          fileIds.national_id_image.toString()
        );
      }
      if (fileIds.driving_licence) {
        formData.append("driving_licence", fileIds.driving_licence.toString());
      }
      if (fileIds.subscription_image) {
        formData.append(
          "subscription_image",
          fileIds.subscription_image.toString()
        );
      }
      if (fileIds.lawyer_licence) {
        formData.append("lawyer_licence", fileIds.lawyer_licence.toString());
      }

      // Append form data
      Object.entries(lawyerData).forEach(([key, value]) => {
        if (key === "phone") {
          formData.append(key, value.replace("+", ""));
        } else {
          formData.append(key, value);
        }
      });

      const strongPassword = generateStrongPassword();
      formData.append("password", strongPassword);

      try {
        const res = await CreateLawyer(formData, lang);
        if (res) {
          // Reset data after successful creation
          setLawyerData({
            name: "",
            phone: "",
            driving_licence_number: "",
            email: "",
            address: "",
            category_id: "",
            status: "active",
          });
          setFileIds({
            lawyer_licence: null,
            driving_licence: null,
            national_id_image: null,
            subscription_image: null,
          });
          setLoading(true);

          reToast.success(res.message);

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }

          // Close dialog if in dialog mode
          if (asDialog) {
            setDialogOpen(false);
          } else {
            router.back();
          }
        } else {
          reToast.error(t("Failed to create Lawyer"));
          setLoading(true);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;

        const fields = [
          "name",
          "phone",
          "driving_licence_number",
          "category_id",
          "address",
          "email",
          "password",
          "lawyer_licence",
          "national_id_image",
          "driving_licence",
          "subscription_image",
        ];

        let errorMessage = "Something went wrong.";

        for (let field of fields) {
          const fieldErrorKey = `${field}`;
          const error = axiosError.response?.data?.errors?.[fieldErrorKey];
          if (error) {
            errorMessage = error[0];
            break;
          }
        }

        reToast.error(errorMessage);
        setLoading(true);
      }
    },
    [
      fileIds,
      lawyerData,
      generateStrongPassword,
      lang,
      onSuccess,
      asDialog,
      router,
      t,
    ]
  );

  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));

  const fetchData = useCallback(async () => {
    try {
      const countriesData = await getCategory("lawyer", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [lang]);

  useEffect(() => {
    fetchData();
  }, [flag, fetchData]);

  // Render as dialog if asDialog prop is true
  if (asDialog) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {dialogTrigger || (
            <Button variant="outline">{t("Create Lawyer")}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-[800px] h-[90%] overflow-y-auto">
          <FormContentWithoutAnimations
            lawyerData={lawyerData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleFileIdChange={handleFileIdChange}
            handleSubmit={handleSubmit}
            loading={loading}
            t={t}
            transformedCategories={transformedCategories}
            setFlag={setFlag}
            flag={flag}
            fileIds={fileIds}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Render as standalone form by default
  return (
    <FormContentWithAnimations
      lawyerData={lawyerData}
      handleInputChange={handleInputChange}
      handleSelectChange={handleSelectChange}
      handleFileIdChange={handleFileIdChange}
      handleSubmit={handleSubmit}
      loading={loading}
      t={t}
      transformedCategories={transformedCategories}
      setFlag={setFlag}
      flag={flag}
      fileIds={fileIds}
    />
  );
};

export default LawyerForm;
