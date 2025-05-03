"use Contact List";
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
import { getCategory } from "@/services/category/category";
import { toast as reToast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { CreateContactList } from "@/services/contact-list/contact-list";
import { CleaveInput } from "@/components/ui/cleave";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface ContactListData {
  name: string;
  phone: string;
  email: string;
  category_id: string;
}
const CreateContact = ({ setFlag, flag }: { setFlag: any; flag: any }) => {
  const [category, setCategory] = useState<any[]>([]);
  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  const [contactList, setContactList] = useState<ContactListData>({
    name: "",
    phone: "",
    email: "",
    category_id: "",
  });
  const { t } = useTranslate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactList((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: any) => {
    setContactList((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(false);

    const formData = new FormData();

    // Append images if they exist

    // Append form data
    Object.entries(contactList).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await CreateContactList(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setContactList({
          name: "",
          phone: "",
          email: "",
          category_id: "",
        });
        setFlag(!flag);
        setIsloading(true);

        setOpen(false); // Close the modal after success

        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["name", "email", "phone", "category_id"];

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

  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));
  const fetchData = async () => {
    try {
      const countriesData = await getCategory("contact_list", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };
  const handleOpen = () => {
    setOpen(!open);
    fetchData();
  };
  return (
    <>
      {" "}
      <Button
        onClick={handleOpen}
        className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
      >
        {t("Create Contact List")}
      </Button>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent size="2xl" className="gap-3 h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Create a New Contact List")}
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
                    name="name"
                    placeholder={t("Enter User")}
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
                    name="email"
                    placeholder={t("Enter email address")}
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
                    name="phone"
                    placeholder={t("Your phone number")}
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
                    menu={transformedCategories}
                    setSelectedValue={(value) => handleSelectChange(value)}
                    selectedValue={contactList["category_id"]}
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
                    className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
                    variant="outline"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!loading}
                  className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {!loading ? t("Loading") : t("Create Contact List")}{" "}
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
