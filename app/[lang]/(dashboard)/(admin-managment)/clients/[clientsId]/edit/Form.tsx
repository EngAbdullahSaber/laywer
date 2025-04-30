import { Button } from "@/components/ui/button";
import BasicSelect from "@/app/[lang]/(dashboard)/(admin-managment)/lawyer/[lawyerId]/edit/BasicSelect";
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
import { getSpecifiedClient, UpdateClients } from "@/services/clients/clients";
import { UploadImage } from "@/services/auth/auth";
import CreateClientCategory from "@/app/[lang]/(dashboard)/(category-mangement)/client-category/CreateClientCategory";
import { CleaveInput } from "@/components/ui/cleave";
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  name: string;
  phone: string;
  email: string;
  address: string;
  category_id: string;
  national_id_number: string;
  details: string;
}
const Form = () => {
  const { t } = useTranslate();
  const [category, setCategory] = useState<any[]>([]);
  const { lang, clientsId } = useParams();
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    name: "",
    phone: "",
    details: "",
    email: "",
    national_id_number: "",
    category_id: "",
    address: "",
  });
  const [images, setImages] = useState<{
    client_files: any; // Array of file IDs instead of a single file ID
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
  console.log(images.client_files);
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
    if (Array.isArray(images.client_files) && images.client_files.length > 0) {
      images.client_files.forEach((fileId, index) => {
        if (
          images.client_files &&
          typeof images.client_files == "object" &&
          images.client_files.image_id
        ) {
          params.append(
            `client_files[${index}]`,
            images.client_files[index].image_id
          );
        } else {
          params.append(`client_files[${index}]`, fileId.image_id);
        }
      });
    }

    return params.toString();
  };

  const getLawyerData = async () => {
    try {
      const res = await getSpecifiedClient(lang, clientsId);
      if (res?.body) {
        const lawyer = res.body;
        console.log(res.body);
        setLawyerData({
          name: lawyer.name,
          phone: lawyer.phone,
          national_id_number: lawyer.national_id_number,
          email: lawyer.email,
          details: lawyer.details,
          category_id: lawyer.category.id,
          address: lawyer.address,
        });
        setImages({
          client_files: lawyer.client_files,
        });
      }
    } catch (error) {
      console.error("Error fetching lawyer data", error);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);

    const queryParams = buildQueryParams();

    try {
      const res = await UpdateClients(lang, clientsId, queryParams); // Call API to create the lawyer
      if (res) {
        setLoading(true);

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
        "details",
        "email",
        "client_files",
        "national_id_number",
        "category_id",
        "address",
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
      const countriesData = await getCategory("client", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };
  useEffect(() => {
    getLawyerData();
    fetchData();
  }, [flag]);
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle> {t("Edit Client")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="my-4 font-bold">{t("Client Info")}</p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Name">{t("Client Name")}</Label>
                <Input
                  type="text"
                  name="name"
                  value={lawyerData.name}
                  onChange={handleInputChange}
                  placeholder={t("Enter Client Name")}
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
                  type="tel"
                  name="phone"
                  value={
                    lawyerData.phone.startsWith("+966")
                      ? lawyerData.phone
                      : `+966 ${lawyerData.phone.replace(/^966/, "")}`
                  }
                  onChange={handleInputChange}
                  placeholder={t("Enter Client Mobile Number")}
                />
              </div>
              <div className="flex flex-row gap-2 my-2 w-full sm:w-[48%]">
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
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Address">{t("Client Address")}</Label>
                <Input
                  type="text"
                  value={lawyerData.address}
                  name="address"
                  onChange={handleInputChange}
                  placeholder={t("Enter Client Address")}
                />
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Email">{t("Email Address")}</Label>
                <Input
                  type="text"
                  value={lawyerData.email}
                  name="email"
                  onChange={handleInputChange}
                  placeholder={t("Enter Email Address")}
                />
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <Label htmlFor="Identity Number">
                  {t("Identity Number *")}
                </Label>
                <Input
                  type="text"
                  name="national_id_number"
                  value={lawyerData.national_id_number}
                  onChange={handleInputChange}
                  placeholder={t("Enter Identity Number")}
                />
              </div>
              <hr className="my-3 w-full" />
              <p className="my-4 font-bold">{t("Upload Files")}</p>
              <div className="flex flex-col gap-2 w-full">
                <FileUploaderMultiple
                  imageType="client_files"
                  id={images.client_files}
                  onFileChange={handleImageChange}
                />
              </div>
              <hr className="my-3 w-full" />
              <p className="my-4 font-bold">{t("Details")}</p>
              <div className="flex flex-col gap-2 w-[100%]">
                <Label htmlFor="Details">{t("Details *")}</Label>
                <Textarea
                  placeholder={t("Enter Details")}
                  name="details"
                  value={lawyerData.details}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="button"
                disabled={!loading}
                onClick={handleSubmit}
                className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Edit Client")}
              </Button>
            </div>
          </div>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
