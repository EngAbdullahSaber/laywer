"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast as reToast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { AskAboutOrders } from "@/services/new-orders/new-orders";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  message: string;
}
const CreateDate = ({
  getCourtData,
}: {
  getCourtData: () => Promise<void>;
}) => {
  const [lawyerData, setLawyerData] = useState<LaywerData>({
    message: "",
  });
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  const { lang } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(false);

    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await AskAboutOrders(lang, formData); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          message: "",
        });
        reToast.success(res.message); // Display success message
        getCourtData();
        setIsloading(true);

        setIsDialogOpen(false); // Close the dialog after successful deletion
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["message"];

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
  // Handle Flatpickr change event and set value in react-hook-form
  const { t } = useTranslate();
  const handleOpen = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  return (
    <>
      {" "}
      <Button
        className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
        onClick={handleOpen}
      >
        {t("Ask")}
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="md" className="gap-3 h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Send Your Message")}
            </DialogTitle>
          </DialogHeader>
          <div className="h-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message" className="my-4">
                    {t("Your Question")}
                  </Label>
                  <Textarea
                    placeholder={t("Type Here")}
                    rows={3}
                    id="message"
                    name="message"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Submit Button inside form */}
              <div className="flex justify-center gap-3 mt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] text-[#fff] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] "
                    variant="outline"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!loading}
                  className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {!loading ? t("Loading") : t("Send")}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateDate;
