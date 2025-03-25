"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { motion } from "framer-motion";
import { toast as reToast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "./ImageUploader";
import CreateLawyerCategory from "../../../(category-mangement)/lawyer-category/CreateLawyerCategory";
import { getCategory } from "@/services/category/category";
import { AxiosError } from "axios";
import { CreateLawyer } from "@/services/lawyer/lawyer";
import { UploadImage } from "@/services/auth/auth";
import { CleaveInput } from "@/components/ui/cleave";
import { Auth } from "@/components/auth/Auth";
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  name: string;
  phone: string;
  driving_licence_number: string;
  password: string;
  email: string;
  address: string;
  category_id: string;
  status: string;
}
const page = () => {
  const [category, setCategory] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    name: "",
    phone: "",
    driving_licence_number: "",
    password: "",
    email: "",
    address: "",
    category_id: "",
    status: "active",
  });
  const { lang } = useParams();
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

  const { t } = useTranslate();
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);

    const formData = new FormData();

    // Append images if they exist
    if (images.national_id_image) {
      formData.append("national_id_image", images.national_id_image);
    } else {
      formData.append("national_id_image", " 1");
    }
    if (images.driving_licence) {
      formData.append("driving_licence", images.driving_licence);
    } else {
      {
        formData.append("driving_licence", "1");
      }
    }
    if (images.subscription_image) {
      formData.append("subscription_image", images.subscription_image);
    } else {
      formData.append("subscription_image", "1");
    }
    if (images.lawyer_licence) {
      formData.append("lawyer_licence", images.lawyer_licence);
    } else {
      formData.append("lawyer_licence", "1");
    }

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      if (key == "phone") {
        formData.append(key, value.replace("+", ""));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await CreateLawyer(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          name: "",
          phone: "",
          driving_licence_number: "",
          password: "",
          address: "",
          email: "",
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
    fetchData();
  }, [flag]);
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle> {t("Create a New Lawyer")}</CardTitle>
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
                  placeholder={t("Enter Lawyer Name")}
                  name="name"
                  value={lawyerData.name}
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
                  value={lawyerData.phone}
                  type="tel"
                  name="phone"
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
                  value={lawyerData.driving_licence_number}
                  type="number"
                  name="driving_licence_number"
                  onChange={handleInputChange}
                  placeholder={t("Enter Licence Number")}
                />
              </motion.div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                {" "}
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
                    {/* <BasicSelect name="CourtCategory" menu={Lawyer_Category} /> */}
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
              </div>{" "}
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
                  value={lawyerData.address}
                  name="address"
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
                  value={lawyerData.email}
                  name="email"
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.1 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="password">{t("Password")}</Label>
                <Input
                  type="password"
                  placeholder={t("Enter Password")}
                  value={lawyerData.password}
                  name="password"
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>{" "}
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="my-3"
            />{" "}
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Upload Filess")}
            </motion.p>
            <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
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
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.3 }}
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
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.4 }}
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
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.5 }}
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
            {/* Submit Button inside form */}
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
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Create Lawyer")}
              </Button>
            </motion.div>
          </div>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

const allowedRoles = ["super_admin", "admin", "secretary"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
