"use client";
import { Button } from "@/components/ui/button";
import BasicSelect from "./BasicSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import FileUploaderMultiple from "./FileUploaderSingle";
import { useParams } from "next/navigation";
import { getCategory } from "@/services/category/category";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { CreateClients } from "@/services/clients/clients";
import { UploadImage } from "@/services/auth/auth";
import CreateClientCategory from "../../../(category-mangement)/client-category/CreateClientCategory";
import { CleaveInput } from "@/components/ui/cleave";
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { useRouter } from "next/navigation"; // ✅ App Router (new)

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  name: string;
  phone: string;
  email: string;
  category_id: string;
  national_id_number: string;
  address: string;
  details: string;
}
// Zod validation schema

const Form = () => {
  const { t } = useTranslate();
  const [category, setCategory] = useState<any[]>([]);
  const { lang } = useParams();
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData1] = useState<any>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const router = useRouter(); // ✅ initialize router

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    name: "",
    phone: "",
    address: "",
    details: "",
    email: "",
    national_id_number: "",
    category_id: "",
  });
  const [images, setImages] = useState<{
    client_files: string[]; // Array of file IDs instead of a single file ID
  }>({
    client_files: [],
  });
  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  };

  const handleImageChange = async (
    file: File,
    imageType: keyof typeof images
  ) => {
    setLoading(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await UploadImage(formData, lang); // Call API to upload the image
      if (res) {
        // Append the image ID to the array of file IDs
        setImages((prevState) => ({
          ...prevState,
          client_files: [...prevState.client_files, res.body.image_id],
        }));
        setLoading(true);

        reToast.success(res.message); // Show success toast
      } else {
        reToast.error(t("Failed to upload image")); // Show failure toast
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message
      reToast.error(errorMessage); // Show error toast
    }
  };
  const generateStrongPassword = (): string => {
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
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);

    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      if (key == "phone") {
        formData.append(key, value.replace("+", ""));
      } else if (key == "national_id_number") {
        formData.append(key, Number(value));
      } else {
        formData.append(key, value);
      }
    });

    images.client_files.forEach((fileId, index) => {
      formData.append(`client_files[${index}]`, fileId);
    });

    const strongPassword = generateStrongPassword();
    formData.append("password", strongPassword);
    try {
      const res = await CreateClients(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          name: "",
          phone: "",
          address: "",
          email: "",
          national_id_number: "",
          category_id: "",
          details: "",
        });
        setLoading(true);

        reToast.success(res.message); // Display success message
        // router.back();
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
        "password",
        "address",
        "email",
        "category_id",
        "details",
        "national_id_number",
        "client_files",
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
  };

  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));
  const fetchData = async () => {
    try {
      const countriesData = await getCategory("client", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, [flag]);
  return (
    <Card>
      <CardHeader>
        <CardTitle> {t("Create Client")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <motion.p className="my-4 font-bold">{t("Client Info")}</motion.p>
          <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
            <motion.div className="flex flex-col gap-2 w-full sm:w-[48%]">
              <Label htmlFor="Name">{t("Client Name")}</Label>
              <Input
                type="text"
                name="name"
                value={lawyerData.name}
                onChange={handleInputChange}
                placeholder={t("Enter Client Name")}
              />
            </motion.div>

            <motion.div className="flex flex-col gap-2 w-full sm:w-[48%]">
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
                value={lawyerData.phone}
                name="phone"
                onChange={handleInputChange}
                placeholder={t("Enter Client Mobile Number")}
              />
            </motion.div>
            <motion.div className="flex flex-row gap-2 my-2 w-full sm:w-[48%]">
              <div className="!w-[87%]" style={{ width: "87%" }}>
                {" "}
                <Label htmlFor="Category">{t("Client Category")} </Label>
                <BasicSelect
                  menu={transformedCategories}
                  setSelectedValue={(value) => handleSelectChange(value)}
                  selectedValue={lawyerData["category_id"]}
                />{" "}
              </div>
              <div className="w-[8%] mt-5">
                <CreateClientCategory
                  buttonShape={false}
                  setFlag={setFlag}
                  flag={flag}
                />
              </div>
            </motion.div>
            <motion.div className="flex flex-col gap-2 w-full sm:w-[48%]">
              <Label htmlFor="Address">{t("Client Address")}</Label>
              <Input
                type="text"
                value={lawyerData.address}
                name="address"
                onChange={handleInputChange}
                placeholder={t("Enter Client Address")}
              />
            </motion.div>

            <motion.div className="flex flex-col gap-2 w-full sm:w-[48%]">
              <Label htmlFor="Email">{t("Email Address")}</Label>
              <Input
                type="text"
                value={lawyerData.email}
                name="email"
                onChange={handleInputChange}
                placeholder={t("Enter Email Address")}
              />
            </motion.div>

            <motion.div className="flex flex-col gap-2 w-full sm:w-[48%]">
              <Label htmlFor="Identity Number">{t("Identity Number *")}</Label>
              <Input
                value={lawyerData.national_id_number}
                type="text"
                name="national_id_number"
                onChange={handleInputChange}
                placeholder={t("Enter Identity Number")}
              />
            </motion.div>
            <motion.hr className="my-3 w-full" />
            <motion.p className="my-4 font-bold">{t("Upload Files")}</motion.p>
            <motion.div className="flex flex-col gap-2 w-full">
              <FileUploaderMultiple
                imageType="client_files"
                id={images.client_files}
                onFileChange={handleImageChange}
              />
            </motion.div>
            <motion.hr className="my-3 w-full" />
            <motion.p className="my-4 font-bold">{t("Details")}</motion.p>
            <motion.div className="flex flex-col gap-2 w-[100%]">
              <Label htmlFor="Details">{t("Details *")}</Label>
              <Textarea
                placeholder={t("Enter Details")}
                value={lawyerData.details}
                name="details"
                onChange={handleInputChange}
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.7 }}
            className="flex justify-center gap-3 mt-4"
          >
            <Button
              type="button"
              variant="outline"
              className="w-28 border-[#dfc77d] dark:text-[#fff]  dark:hover:bg-[#dfc77d] dark:hover:text-[#000] hover:text-[#000] text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] "
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              disabled={!loading}
              onClick={handleSubmit}
              className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
            >
              {!loading ? t("Loading") : t("Create Client")}
            </Button>
          </motion.div>
        </div>{" "}
      </CardContent>
    </Card>
  );
};

export default Form;
