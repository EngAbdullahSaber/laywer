"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { ReplyOnMessages } from "@/services/messages/messages";
import { useParams } from "next/navigation";
import "./TimeInputStyles.css";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  reply: string;
  meeting_date: string;
}
const CreateDate = ({
  flag,
  setFlag,
  id,
}: {
  flag: any;
  id: any;
  setFlag: any;
}) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [loading, setIsloading] = useState(true); // State to control dialog visibility
  const [lawyerData, setLawyerData] = useState<LaywerData>({
    reply: "",
    meeting_date: "",
  });
  const [time, setTime] = useState("");

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    console.log("Selected Time:", e.target.value);

    // Format the time
    const formattedTime = format(
      parse(e.target.value, "HH:mm", new Date()),
      "h:mm a"
    );
    console.log("Formatted Time:", formattedTime);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDateChange = (date1: Date[]) => {
    const date = new Date(date1[0].toISOString());

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    // Format as yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    setLawyerData({
      ...lawyerData,
      meeting_date: formattedDate.toString(),
    });
  };
  const convertTo24Hour = (time12h) => {
    let [hours, minutes] = time12h.split(":");
    let ampm = time12h.slice(-2).toLowerCase();

    if (ampm === "pm" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (ampm === "am" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    setIsloading(true);
    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("meeting_time", time);
    const data = {
      reply: lawyerData.reply,
      meeting_date: lawyerData.meeting_date,
      meeting_time: convertTo24Hour(time),
    };
    try {
      const res = await ReplyOnMessages(data, id, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          reply: "",
          meeting_date: "",
        });

        reToast.success(res.message); // Display success message
        setIsloading(true);

        setIsDialogOpen(false); // Close the dialog after successful deletion

        setFlag(!flag);
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
        setIsloading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["reply", "meeting_date"];

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
      setIsloading(false);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Reply to Client")}
        </Button>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Reply to Client")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ y: -20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="question" className="my-4">
                  {t("Your Answer")}
                </Label>
                <Textarea
                  placeholder="Type Here"
                  rows={3}
                  name="reply"
                  onChange={handleInputChange}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Title" className="my-4">
                  {t("Date")}
                </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Date About Meeting")}
                  value={
                    lawyerData.meeting_date
                      ? new Date(lawyerData.meeting_date)
                      : ""
                  }
                  onChange={handleDateChange}
                  options={{
                    clickOpens: true,
                    static: true,
                    appendTo: document.body,
                  }}
                  onClick={(e) => e.preventDefault()}
                  id="default-picker"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Title" className="my-4">
                  {t("meeting_time")}
                </Label>

                <Input type="time" value={time} onChange={handleTimeChange} />
              </motion.div>
            </div>

            {/* Submit Button inside form */}
            <motion.div
              initial={{ y: 20 }}
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
                disabled={!loading}
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Send")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;
