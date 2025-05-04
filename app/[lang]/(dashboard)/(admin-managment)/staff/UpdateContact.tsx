"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { getRoles, UpdateStaff } from "@/services/staff/staff";
import { CleaveInput } from "@/components/ui/cleave";
import { Icon } from "@iconify/react";
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  name: string;
  email: string;
  phone: string;
  role_id: string;
}
interface UpdateStaffProps {
  row: any; // This is passed in from the parent, and contains the data for the category to update
  getStaffData: () => void; // Function to reload the category data after the update
}
const UpdateContact: React.FC<UpdateStaffProps> = ({ row, getStaffData }) => {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    name: "",
    phone: "",
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
  const handleSelectChange = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      role_id: value?.id,
    }));
  };
  const fetchDataCategory = async () => {
    try {
      const countriesData = await getRoles(lang);
      setRoles(countriesData?.body?.roles_and_permissions || []);
    } catch (error) {}
  };
  const transformedRoles = roles?.map((item: any) => ({
    id: item.id,
    value: item.role,
    label: item.role,
  }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(false);

    const data = {
      name: lawyerData.name,
      phone: lawyerData.phone,
      email: lawyerData.email,
      role_id: lawyerData.role_id,
    };
    try {
      const res = await UpdateStaff(data, row.original.id, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          name: "",
          email: "",
          phone: "",
          role_id: "",
        });
        setIsloading(true);

        reToast.success(res.message); // Display success message
        getStaffData();
        setOpen(false); // Close the modal after success
      } else {
        reToast.error(t("Failed to update employee")); // Show a fallback failure message
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["name", "email", "phone", "role_id"];

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
      setIsloading(true);
    }
  };
  console.log(lawyerData);
  useEffect(() => {
    if (row?.original) {
      setLawyerData({
        name: row.original.name,
        email: row.original.email,
        phone: row.original.phone,
        role_id: row.original?.role_with_permission?.id,
      });
    }
  }, [row]);
  const handleOpen = () => {
    setOpen(!open);
    fetchDataCategory();
  };
  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="h-7 w-7"
        onClick={handleOpen}
        color="secondary"
      >
        <Icon icon="heroicons:pencil" className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent size="2xl" className="gap-3 h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Update Staff")}
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
                    name="name"
                    value={lawyerData.name}
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
                    placeholder={t("Enter email address")}
                    value={lawyerData.email}
                    name="email"
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
                    options={{
                      prefix: "+966",
                      delimiter: " ",
                      blocks: [4, 2, 3, 4],
                      numericOnly: true,
                      uppercase: true,
                    }}
                    type="tel"
                    id="phone"
                    placeholder={t("Your phone number")}
                    value={
                      lawyerData.phone.startsWith("+966")
                        ? lawyerData.phone
                        : `+966 ${lawyerData.phone.replace(/^966/, "")}`
                    }
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
                    className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000]  hover:text-[#000]  hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
                    variant="outline"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {t("Update Staff")}{" "}
                </Button>
              </motion.div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateContact;
