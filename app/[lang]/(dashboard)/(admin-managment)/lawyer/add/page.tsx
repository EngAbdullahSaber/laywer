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

    // Append images if they exist
    if (images.national_id_image)
      formData.append("national_id_image", images.national_id_image);
    if (images.driving_licence)
      formData.append("driving_licence", images.driving_licence);
    if (images.subscription_image)
      formData.append("subscription_image", images.subscription_image);
    if (images.lawyer_licence)
      formData.append("lawyer_licence", images.lawyer_licence);

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
        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
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
                onClick={handleSubmit}
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Lawyer")}
              </Button>
            </motion.div>
          </div>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

const allowedRoles = ["super_admin"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import { useTranslate } from "@/config/useTranslation";
// import BasicSelect from "@/components/common/Select/BasicSelect";
// import { motion } from "framer-motion";

// const schema = z.object({
//   Name: z
//     .string()
//     .min(3, { message: "errorLawyer.LawyerNameMin" })
//     .max(20, { message: "errorLawyer.LawyerNameMax" }),
//   phone: z.string().refine((value) => value.length === 11, {
//     message: "errorLawyer.Phone",
//   }),
//   Licence: z.string().refine((value) => value.length === 11, {
//     message: "errorLawyer.Licence",
//   }),
//   email: z
//     .string()
//     .min(8, { message: "errorLawyer.LawyerEmailMin" })
//     .max(20, { message: "errorLawyer.LawyerEmailMax" }),
//   Address: z
//     .string()
//     .min(8, { message: "errorLawyer.LawyerAddressMin" })
//     .max(25, { message: "errorLawyer.LawyerAddressMax" }),

//   password: z
//     .string()
//     .min(8, {
//       message: "errorLawyer.CasepasswordMin",
//     })
//     .max(25, {
//       message: "errorLawyer.CasepasswordMax",
//     }),
//   LawyerCategory: z.string().min(8, { message: "errorCourt.clientAddressMin" }),
// });

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import ImageUploader from "./ImageUploader";
// import CreateLawyerCategory from "../../../(category-mangement)/lawyer-category/CreateLawyerCategory";

// const page = () => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//   });

//   function onSubmit(data: z.infer<typeof schema>) {
//     toast.message(JSON.stringify(data, null, 2));
//   }
//   const Lawyer_Category: { value: string; label: string }[] = [
//     { value: "عائلى", label: "عائلى" },
//     { value: "جنائي", label: "جنائي" },
//     { value: "مدنى", label: "مدنى" },
//   ];
//   const { t } = useTranslate();
//   return (
//     <div>
//       {" "}
//       <Card>
//         <CardHeader>
//           <CardTitle> {t("Update Lawyer")}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="flex flex-col justify-between "
//           >
//             <motion.p
//               initial={{ y: -30 }}
//               whileInView={{ y: 0 }}
//               transition={{ duration: 1.2 }}
//               className="my-4 font-bold"
//             >
//               {t("Lawyer Info")}
//             </motion.p>
//             <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label
//                   htmlFor="Name"
//                   className={cn("", {
//                     "text-destructive": errors.Name,
//                   })}
//                 >
//                   {t("Lawyer Name")}
//                 </Label>
//                 <Input
//                   type="text"
//                   {...register("Name")}
//                   placeholder={t("Enter Lawyer Name")}
//                   className={cn("", {
//                     "border-destructive focus:border-destructive": errors.Name,
//                   })}
//                 />
//                 {errors.Name && (
//                   <p
//                     className={cn("text-xs", {
//                       "text-destructive": errors.Name,
//                     })}
//                   >
//                     {t(errors.Name.message)}
//                   </p>
//                 )}
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 0.7 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label
//                   htmlFor="phone"
//                   className={cn("", {
//                     "text-destructive": errors.phone,
//                   })}
//                 >
//                   {t("Mobile Number")}
//                 </Label>
//                 <Input
//                   type="number"
//                   placeholder={t("Enter Mobile Number")}
//                   {...register("phone")}
//                   className={cn("", {
//                     "border-destructive focus:border-destructive": errors.phone,
//                   })}
//                 />
//                 {errors.phone && (
//                   <p className="text-xs text-destructive">
//                     {t(errors.phone.message)}
//                   </p>
//                 )}
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 0.7 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label
//                   htmlFor="Licence"
//                   className={cn("", {
//                     "text-destructive": errors.Licence,
//                   })}
//                 >
//                   {t("Licence Number")}
//                 </Label>
//                 <Input
//                   type="number"
//                   placeholder={t("Enter Licence Number")}
//                   {...register("Licence")}
//                   className={cn("", {
//                     "border-destructive focus:border-destructive":
//                       errors.Licence,
//                   })}
//                 />
//                 {errors.Licence && (
//                   <p className="text-xs text-destructive">
//                     {t(errors.Licence.message)}
//                   </p>
//                 )}
//               </motion.div>
//               <div className="flex flex-col gap-2 w-full sm:w-[48%]">
//                 {" "}
//                 <motion.div
//                   initial={{ y: -50 }}
//                   whileInView={{ y: 0 }}
//                   transition={{ duration: 0.8 }}
//                   className="flex flex-row justify-between items-center"
//                 >
//                   <div className="!w-[87%]" style={{ width: "87%" }}>
//                     <Label
//                       htmlFor="Court_Category"
//                       className={cn("", {
//                         "text-destructive": errors.LawyerCategory,
//                       })}
//                     >
//                       {t("Lawyer Category")}
//                     </Label>
//                     <BasicSelect
//                       name="CourtCategory"
//                       menu={Lawyer_Category}
//                       control={control}
//                       errors={errors}
//                     />
//                   </div>
//                   <div className="w-[8%] mt-5">
//                     <CreateLawyerCategory buttonShape={false} />
//                   </div>
//                 </motion.div>
//               </div>{" "}
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 0.9 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label
//                   htmlFor="Address"
//                   className={cn("", {
//                     "text-destructive": errors.Address,
//                   })}
//                 >
//                   {t("Address")}
//                 </Label>
//                 <Input
//                   type="text"
//                   {...register("Address")}
//                   placeholder={t("Enter Address")}
//                   className={cn("", {
//                     "border-destructive focus:border-destructive":
//                       errors.Address,
//                   })}
//                 />
//                 {errors.Address && (
//                   <p className="text-xs text-destructive">
//                     {t(errors.Address.message)}
//                   </p>
//                 )}
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 1 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label
//                   htmlFor="email"
//                   className={cn("", {
//                     "text-destructive": errors.email,
//                   })}
//                 >
//                   {t("Email")}
//                 </Label>
//                 <Input
//                   type="email"
//                   {...register("email")}
//                   placeholder={t("Enter Email")}
//                   className={cn("", {
//                     "border-destructive focus:border-destructive": errors.email,
//                   })}
//                 />
//                 {errors.email && (
//                   <p className="text-xs text-destructive">
//                     {t(errors.email.message)}
//                   </p>
//                 )}
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 1.1 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label
//                   htmlFor="password"
//                   className={cn("", {
//                     "text-destructive": errors.password,
//                   })}
//                 >
//                   {t("Password")}
//                 </Label>
//                 <Input
//                   type="password"
//                   {...register("password")}
//                   placeholder={t("Enter Password")}
//                   className={cn("", {
//                     "border-destructive focus:border-destructive":
//                       errors.password,
//                   })}
//                 />
//                 {errors.password && (
//                   <p className="text-xs text-destructive">
//                     {t(errors.password.message)}
//                   </p>
//                 )}
//               </motion.div>
//             </div>{" "}
//             <motion.hr
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 1.1 }}
//               className="my-3"
//             />{" "}
//             <motion.p
//               initial={{ y: -30 }}
//               whileInView={{ y: 0 }}
//               transition={{ duration: 1.2 }}
//               className="my-4 font-bold"
//             >
//               {t("Upload Filess")}
//             </motion.p>
//             <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 1.2 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label>{t("Licensing photo")}</Label>
//                 <ImageUploader />
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 1.3 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label>{t("licence photo")}</Label>
//                 <ImageUploader />
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 1.4 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label>{t("Membership photo")}</Label>
//                 <ImageUploader />
//               </motion.div>
//               <motion.div
//                 initial={{ y: -50 }}
//                 whileInView={{ y: 0 }}
//                 transition={{ duration: 1.5 }}
//                 className="flex flex-col gap-2 w-full sm:w-[48%]"
//               >
//                 <Label>{t("ID photo")}</Label>
//                 <ImageUploader />
//               </motion.div>
//             </div>
//             {/* Submit Button inside form */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 1.2 }}
//               className="flex justify-center gap-3 mt-4"
//             >
//               <Button
//                 type="button"
//                 className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
//                 variant="outline"
//               >
//                 {t("Cancel")}
//               </Button>
//               <Button
//                 type="submit"
//                 className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
//               >
//                 {t("Update Lawyer")}
//               </Button>
//             </motion.div>
//           </form>{" "}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default page;
