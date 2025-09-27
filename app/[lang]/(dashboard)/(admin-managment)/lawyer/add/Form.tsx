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
import ImageUploader from "./ImageUploader";
import CreateLawyerCategory from "../../../(category-mangement)/lawyer-category/CreateLawyerCategory";
import { getCategory } from "@/services/category/category";
import { AxiosError } from "axios";
import { CreateLawyer } from "@/services/lawyer/lawyer";
import { UploadImage } from "@/services/auth/auth";
import { CleaveInput } from "@/components/ui/cleave";
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
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
    handleImageChange,
    handleSubmit,
    loading,
    t,
    transformedCategories,
    setFlag,
    flag,
    images,
  }: any) => (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create a New Lawyer")}</CardTitle>
        </CardHeader>
        <ScrollArea>
          {" "}
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
                  <ImageUploader
                    imageType="driving_licence"
                    id={images.driving_licence}
                    onFileChange={handleImageChange}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("licence photo")}</Label>
                  <ImageUploader
                    imageType="lawyer_licence"
                    id={images.lawyer_licence}
                    onFileChange={handleImageChange}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("Membership photo")}</Label>
                  <ImageUploader
                    imageType="subscription_image"
                    id={images.subscription_image}
                    onFileChange={handleImageChange}
                  />
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col gap-2 w-full sm:w-[48%]"
                >
                  <Label>{t("ID photo")}</Label>
                  <ImageUploader
                    imageType="national_id_image"
                    id={images.national_id_image}
                    onFileChange={handleImageChange}
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
                  {!loading ? t("Loading") : t("Create Lawyer")}
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
    handleImageChange,
    handleSubmit,
    loading,
    t,
    transformedCategories,
    setFlag,
    flag,
    images,
  }: any) => (
    <div>
      <Card>
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
                <ImageUploader
                  imageType="driving_licence"
                  id={images.driving_licence}
                  onFileChange={handleImageChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("licence photo")}</Label>
                <ImageUploader
                  imageType="lawyer_licence"
                  id={images.lawyer_licence}
                  onFileChange={handleImageChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("Membership photo")}</Label>
                <ImageUploader
                  imageType="subscription_image"
                  id={images.subscription_image}
                  onFileChange={handleImageChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label>{t("ID photo")}</Label>
                <ImageUploader
                  imageType="national_id_image"
                  id={images.national_id_image}
                  onFileChange={handleImageChange}
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
                {!loading ? t("Loading") : t("Create Lawyer")}
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
  const [data, setData] = useState<any>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const router = useRouter();

  const [lawyerData, setLawyerData] = useState<LaywerData>({
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

  const [images, setImages] = useState<{
    lawyer_licence: File | null;
    driving_licence: File | null;
    national_id_image: File | null;
    subscription_image: File | null;
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

  const handleImageChange = useCallback(
    async (file: File, imageType: keyof typeof images) => {
      setLoading(false);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await UploadImage(formData, lang); // Call API to create the lawyer
        if (res) {
          // Reset data after successful creation
          setImages((prevState) => ({
            ...prevState,
            [imageType]: res.body.image_id,
          }));
          reToast.success(res.message); // Display success message
          setLoading(true);
        } else {
          reToast.error(t("Failed to create upload image")); // Show a fallback failure message
          setLoading(true);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        let errorMessage = "Something went wrong."; // Default fallback message
        reToast.error(errorMessage); // Display the error message in the toast
        setLoading(true);
      }
    },
    [lang, t]
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

      // Append images if they exist
      if (images.national_id_image) {
        formData.append("national_id_image", images.national_id_image);
      }
      if (images.driving_licence) {
        formData.append("driving_licence", images.driving_licence);
      }
      if (images.subscription_image) {
        formData.append("subscription_image", images.subscription_image);
      }
      if (images.lawyer_licence) {
        formData.append("lawyer_licence", images.lawyer_licence);
      }

      // Append form data
      Object.entries(lawyerData).forEach(([key, value]) => {
        if (key == "phone") {
          formData.append(key, value.replace("+", ""));
        } else {
          formData.append(key, value);
        }
      });
      const strongPassword = generateStrongPassword();
      formData.append("password", strongPassword);
      try {
        const res = await CreateLawyer(formData, lang); // Call API to create the lawyer
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
          setImages({
            lawyer_licence: null,
            driving_licence: null,
            national_id_image: null,
            subscription_image: null,
          });
          setLoading(true);

          reToast.success(res.message); // Display success message

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
          reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
          setLoading(true);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;

        // Construct the dynamic key based on field names and the current language
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

        let errorMessage = "Something went wrong."; // Default fallback message

        // Loop through the fields to find the corresponding error message
        for (let field of fields) {
          const fieldErrorKey = `${field}`; // Construct key like "name.en" or "name.ar"
          const error = axiosError.response?.data?.errors?.[fieldErrorKey];
          if (error) {
            errorMessage = error[0]; // Retrieve the first error message for the field
            break; // Exit the loop once the error is found
          }
        }

        // Show the error in a toast notification
        reToast.error(errorMessage); // Display the error message in the toast
        setLoading(true);
      }
    },
    [
      images,
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
    } catch (error) {}
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
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            loading={loading}
            t={t}
            transformedCategories={transformedCategories}
            setFlag={setFlag}
            flag={flag}
            images={images}
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
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      loading={loading}
      t={t}
      transformedCategories={transformedCategories}
      setFlag={setFlag}
      flag={flag}
      images={images}
    />
  );
};

export default LawyerForm;
