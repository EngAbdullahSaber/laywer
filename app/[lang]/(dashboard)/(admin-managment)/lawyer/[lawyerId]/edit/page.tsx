"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTranslate } from "@/config/useTranslation";
import BasicSelect from "./BasicSelect";
import { motion } from "framer-motion";

import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "./ImageUploader";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { UpdateLawyer, getSpecifiedLawyer } from "@/services/lawyer/lawyer";
import { getCategory } from "@/services/category/category";
import { UploadImage } from "@/services/auth/auth";
import CreateLawyerCategory from "@/app/[lang]/(dashboard)/(category-mangement)/lawyer-category/CreateLawyerCategory";

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

const page = () => {
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

  const { lang, lawyerId } = useParams();

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
        // Handle the name and description fields dynamically for localization

        params.append(key, value);
      }
    });

    // Append images separately as form data for file uploads
    if (images.national_id_image && typeof images.national_id_image != "object")
      params.append("national_id_image", images.national_id_image);
    if (images.driving_licence && typeof images.driving_licence != "object")
      params.append("driving_licence", images.driving_licence);
    if (
      images.subscription_image &&
      typeof images.subscription_image != "object"
    )
      params.append("subscription_image", images.subscription_image);
    if (images.lawyer_licence && typeof images.lawyer_licence != "object")
      params.append("lawyer_licence", images.lawyer_licence);

    return params.toString();
  };

  const getLawyerData = async () => {
    try {
      const res = await getSpecifiedLawyer(lang, lawyerId);
      if (res?.body["0"]) {
        const lawyer = res.body["0"];

        setLawyerData({
          name: lawyer.name,
          phone: lawyer.phone,
          driving_licence_number: lawyer.driving_licence_number,
          email: lawyer.email,
          address: lawyer.address,
          category_id: lawyer.category.id,
          status: lawyer.status,
        });
        setImages({
          national_id_image: lawyer.national_id_image,
          driving_licence: lawyer.driving_licence,
          subscription_image: lawyer.subscription_image,
          lawyer_licence: lawyer.lawyer_licence,
        });
      }
    } catch (error) {
      console.error("Error fetching lawyer data", error);
    }
  };

  const handleSelectChange = (value: string) => {
    setLawyerData((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  };

  const handleImageChange = async (
    file: File,
    imageType: keyof typeof images
  ) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await UploadImage(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        console.log(res.body.image_id);
        setImages((prevState) => ({
          ...prevState,
          [imageType]: res.body.image_id,
        }));
        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create upload image")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language

      let errorMessage = "Something went wrong."; // Default fallback message

      // Loop through the fields to find the corresponding error message

      // Show the error in a toast notification
      reToast.error(errorMessage); // Display the error message in the toast
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const queryParams = buildQueryParams();
    // Append images if they exist
    if (images.national_id_image && typeof images.national_id_image != "object")
      formData.append("national_id_image", images.national_id_image);
    if (images.driving_licence && typeof images.driving_licence != "object")
      formData.append("driving_licence", images.driving_licence);
    if (
      images.subscription_image &&
      typeof images.subscription_image != "object"
    )
      formData.append("subscription_image", images.subscription_image);
    if (images.lawyer_licence && typeof images.lawyer_licence != "object")
      formData.append("lawyer_licence", images.lawyer_licence);

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await UpdateLawyer(queryParams, lawyerId, lang); // Call API to create the lawyer
      if (res) {
        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to update Lawyer"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message

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

      // Loop through the fields to find the corresponding error message
      for (let field of fields) {
        const error = axiosError.response?.data?.errors?.[field];
        if (error) {
          errorMessage = error[0]; // Retrieve the first error message for the field
          break;
        }
      }

      reToast.error(errorMessage); // Display the error message in the toast
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
    } catch (error) {
      reToast.error("Failed to fetch data");
    }
  };

  // On mount, fetch data
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
                <Input
                  type="number"
                  name="phone"
                  value={lawyerData.phone}
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
                      setSelectedValue={(value) =>
                        handleSelectChange(value, "category_id")
                      }
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
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Update Lawyer")}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
