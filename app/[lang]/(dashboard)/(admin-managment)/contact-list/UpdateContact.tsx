"use Contact List";
import BasicSelect from "./BasicSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslate } from "@/config/useTranslation";
import { getCategory } from "@/services/category/category";
import { toast as reToast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { UpdateContactList } from "@/services/contact-list/contact-list";
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
const UpdateContact = ({
  getContactListData,
  row,
}: {
  getContactListData: any;
  row: any;
}) => {
  const [category, setCategory] = useState<any[]>([]);
  const { lang } = useParams();
  const [open, setOpen] = useState(false);

  const [contactList, setContactList] = useState<ContactListData>({
    name: "",
    phone: "",
    email: "",
    category_id: "",
  });
  const { t, loading, error } = useTranslate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactList((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Add each key-value pair to the URLSearchParams object
    if (contactList.name && contactList.name !== row.original.name) {
      params.append("name", contactList.name);
    }
    if (contactList.email && contactList.email !== row.original.email) {
      params.append("email", contactList.email);
    }
    if (contactList.phone && contactList.phone !== row.original.phone) {
      params.append("phone", contactList.phone);
    }
    if (
      contactList.category_id &&
      contactList.category_id?.id !== row.original.category?.id
    ) {
      params.append("category_id", contactList.category_id);
    }

    // Convert to string
    return params.toString();
  };
  // Handle select change
  const handleSelectChange = (value: string) => {
    setContactList((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  };
  console.log(contactList.category_id);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = buildQueryParams();
    try {
      const res = await UpdateContactList(queryParams, row.original.id, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setContactList({
          name: "",
          phone: "",
          email: "",
          category_id: "",
        });
        getContactListData();
        setOpen(false); // Close the modal after success

        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
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
    } catch (error) {
      reToast.error("Failed to fetch data");
    }
  };
  useEffect(() => {
    setContactList({
      name: row.original.name,
      phone: row.original.phone,
      email: row.original.email,
      category_id: row.original.category,
    });
  }, [row]);
  const handleOpen = () => {
    setOpen(!open);
    fetchData();
  };
  return (
    <>
      {" "}
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
              {t("Update a New Contact List")}
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
                    value={contactList.name}
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
                    value={contactList.email}
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
                    value={contactList.phone}
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
                    selectedValue={row.original.category}
                  />
                </motion.div>
                {/* <div className="flex flex-col gap-2 w-[48%]">
        
       </div> */}

                {/* <div className="flex flex-col gap-2">
           <Label>{t("Select Gender")}</Label>
           <Radio text1={"Female"} text2={"Male"} />
         </div> */}
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
                  {t("Update Contact List")}{" "}
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
