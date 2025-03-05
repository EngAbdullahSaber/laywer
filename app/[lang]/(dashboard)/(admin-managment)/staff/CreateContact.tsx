"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { CreateStaff, getRoles } from "@/services/staff/staff";
import { CleaveInput } from "@/components/ui/cleave";
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role_id: string;
}
const CreateContact = ({ setFlag, flag }: { setFlag: any; flag: any }) => {
  const category: { value: string; label: string }[] = [
    { value: "مسئول", label: "مسئول" },
    { value: "محامى", label: "محامى" },
    { value: "عميل", label: "عميل" },
  ];
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    name: "",
    phone: "",
    password: "",
    email: "",
    role_id: "",
  });
  const { lang } = useParams();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectChange = (value: string) => {
    setLawyerData((prevData) => ({
      ...prevData,
      role_id: value?.id,
    }));
  };
  const fetchDataCategory = async () => {
    try {
      const countriesData = await getRoles(lang);
      setRoles(countriesData?.body?.roles_and_permissions || []);
    } catch (error) {
      reToast.error("Failed to fetch data");
    }
  };
  const transformedRoles = roles?.map((item: any) => ({
    id: item.id,
    value: item.role,
    label: item.role,
  }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await CreateStaff(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role_id: "",
        });

        reToast.success(res.message); // Display success message
        setFlag(!flag);

        setOpen(false); // Close the modal after success
      } else {
        reToast.error(t("Failed to create services")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["name", "email", "phone", "password", "role_id"];

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
  const handleOpen = () => {
    setOpen(!open);
    fetchDataCategory();
  };
  return (
    <>
      <Button
        className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
        onClick={handleOpen}
      >
        {t("Create Staff")}
      </Button>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent size="2xl" className="gap-3 h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Create a New Staff")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div>
              <div className="flex flex-row justify-between items-center  gap-4">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="Name">{t("userss")}</Label>
                  <Input
                    id="Name"
                    type="text"
                    placeholder={t("Enter User")}
                    value={lawyerData.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="Email">{t("Email Address")}</Label>
                  <Input
                    id="Email"
                    type="text"
                    value={lawyerData.email}
                    placeholder={t("Enter email address")}
                    name="email"
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="Password">{t("Password")}</Label>
                  <Input
                    type="Password"
                    placeholder={t("Enter passowrd")}
                    name="password"
                    value={lawyerData.passowrd}
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="phone">{t("Phone Number")}</Label>
                  <CleaveInput
                    id="prefix"
                    options={{
                      prefix: "+966",
                      delimiter: " ",
                      blocks: [4, 2, 3, 4],
                      numericOnly: true,
                      uppercase: true,
                    }}
                    type="tel"
                    placeholder={t("Your phone number")}
                    value={lawyerData.phone}
                    name="phone"
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="Category">{t("Category")}</Label>
                  <BasicSelect
                    menu={transformedRoles}
                    setSelectedValue={(value) => handleSelectChange(value)}
                    selectedValue={lawyerData["role_id"]}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className=" flex justify-center gap-3 mt-4"
              >
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
                    variant="outline"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {t("Create Staff")}{" "}
                </Button>
              </motion.div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateContact;
