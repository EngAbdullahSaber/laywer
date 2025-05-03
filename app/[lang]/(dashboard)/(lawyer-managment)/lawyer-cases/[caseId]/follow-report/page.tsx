"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BasicSelect from "./BasicSelect";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CleaveInput } from "@/components/ui/cleave";
import ControlledRadio from "./ControlledRadio";
import { getSpecifiedCases } from "@/services/cases/cases";
import { useParams } from "next/navigation";
import { UploadImage } from "@/services/auth/auth";
import { AxiosError } from "axios";
import { toast as reToast } from "react-hot-toast";
import { Auth } from "@/components/auth/Auth";
import { UpdateCases } from "@/services/lawyer-cases/lawyer-cases";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
  message: any;
}

const CaseFollowReport = () => {
  const [selected, setSelected] = useState("There is no appointment");
  const [caseName, setCaseName] = useState("");
  const [caseLocation, setCaseLocation] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [plaintiffName, setPlaintiffName] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState<any>("");
  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [nextDay, setNextDay] = useState<any>("");
  const [followUpProcedures, setFollowUpProcedures] = useState("");
  const [whatShouldBeDone, setWhatShouldBeDone] = useState("");
  const [fileId, setFileId] = useState("");
  const [data, setData] = useState<any>([]);
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  const { lang, caseId } = useParams();

  const getCasesData = async () => {
    try {
      const res = await getSpecifiedCases(lang, caseId);

      setData(res?.body || []);
      setCaseName(res?.body?.title);
      setCaseNumber(res?.body?.main_case_number);

      setPlaintiffName(res?.body?.client?.name);

      setDefendantName(res?.body?.defendants);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    getCasesData();
  }, [caseId]);
  const Days = [
    { value: "السبت", label: "السبت" },
    { value: " الاحد", label: " الاحد" },
    { value: "الاثنين", label: "الاثنين" },
    { value: "الثلاثاء", label: "الثلاثاء" },
    { value: "الاربعاء", label: "الاربعاء" },
    { value: "الخميس", label: "الخميس" },
    { value: "الجمعة", label: "الجمعة" },
  ];

  const { t } = useTranslate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    generatePDF();
  };

  const generatePDF = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تقرير متابعة قضية</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
  
          :root {
            --font-color: #070707;
            --highlight-color: #af9c5e;
            --header-bg-color: #1a1a1a;
            --footer-bg-color: #1a1a1a;
            --table-img-bg-color: #2c2c2c;
            --background-gradient: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
          }
  
          body {
            margin: 0;
            position: relative;
            padding: 1cm 2cm;
            background: var(--background-gradient);
            color: var(--font-color);
            font-family: 'Tajawal', sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            overflow-x: hidden;
          }
  
          a {
            color: var(--highlight-color);
            text-decoration: none;
          }
  
          hr {
            margin: 1cm 0;
            height: 0;
            border: 0;
            border-top: 1mm solid var(--highlight-color);
          }
  
          header {
            padding: 1cm 0;
            text-align: center;
            position: relative;
            z-index: 2;
          }
  
          header .logoAndName {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
  
          header .logo {
            width: 60px;
            height: 60px;
          }
  
          header .title {
            font-size: 30px;
            font-weight: bold;
            color: var(--highlight-color);
          }
  
          header h2 {
            font-size: 24px;
            color: var(--highlight-color);
            margin: 10px 0;
          }
  
          header h3 {
            font-size: 18px;
            color: var(--font-color);
            margin: 10px 0;
          }
  
          header p {
            margin: 5px 0;
          }
  
          .details-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);      
            gap: 20px;
            margin: 20px 0;
            position: relative;
            z-index: 2;
          }
  
          .details-section div {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgb(0 0 0 / 39%);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
  
          .details-section div:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }
  
          .details-section h3 {
            font-size: 22px;
            color: var(--highlight-color);
            margin-bottom: 10px;
          }
  
          .details-section p {
            margin: 5px 0;
            font-size: 20px;

          }
  
          /* Make the last div take full width */
          .details-section div:last-child {
            grid-column: 1 / -1; /* Span across all columns */
          }
  
          footer {
            padding: 1cm 0;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            color: var(--font-color);
                        box-shadow: 0 4px 6px rgb(0 0 0 / 39%);

            font-size: 12pt;
            position: relative;
            z-index: 2;
          }
  
          footer a {
            margin: 0 10px;
          }
  
          aside {
            text-align: center;
            margin: 20px 0;
            position: relative;
            z-index: 2;
          }
  
          aside b {
            display: block;
            font-size: 18px;
            color: var(--highlight-color);
            margin: 10px 0;
          }
  
          .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            opacity: 0.2; /* Adjust opacity for better readability */
          }
        </style>
      </head>
      <body>
        <img
          src="https://dash-tail.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fline.c2493fdc.png&w=1080&q=75"
          alt="background"
          class="background"
        />
        <header>
          <div class="logoAndName">
            <img
              src="https://msaatylaw.com/wp-content/uploads/2023/10/Capture-removebg-preview-3.png"
              alt="logo"
              class="logo"
            />
            <p class="title">ﻣﻜﺘﺐ اﻟﻤﺤﺎﻣﻲ ﻣﺤﻤﺪ ﺑﻦ ﺳﺎﻣﻲ ﺳﺎعاتي</p>
          </div>
          <h2>تقرير متابعة قضية</h2>
        </header>
  
        <div class="details-section">
          <div>
            <h3>تفاصيل القضية</h3>
            <p><b> رقم الهوية:</b> ${data?.follow_up_reports?.length || 0}</p>
            <p><b>اسم القضية:</b> ${caseName}</p>
            <p><b>رقم القضية:</b> ${caseNumber}</p>
            <p><b>مكان القضية:</b> ${caseLocation}</p>
            <p><b>المدعى:</b> ${plaintiffName}</p>
            <p><b>المدعى عليه:</b> ${defendantName}</p>
          </div>
          <div>
            <h3>التاريخ بالأيام والساعات</h3>
            <p><b>التاريخ:</b> ${currentDate}</p>
            <p><b>الوقت:</b> ${currentTime}</p>
            <p><b>اليوم:</b> ${currentDay?.label || ""}</p>
          </div>
          <div>
            <h3>حالة الموعد</h3>
            <p><b>حالة الموعد:</b> ${selected}</p>
            ${
              selected == "يوجد موعد"
                ? `
                    <h3>تاريخ الموعد القادم بالأيام والساعات</h3>
                    <p><b>التاريخ:</b> ${nextDate}</p>
                    <p><b>الوقت:</b> ${nextTime}</p>
                    <p><b>اليوم:</b> ${nextDay?.label || ""}</p>
                `
                : ""
            }
          </div>
          <div>
            <h3>الإجراءات اللازمة</h3>
            <p><b>إجراءات المتابعة:</b> ${followUpProcedures}</p>
            <p><b>ما يجب القيام به:</b> ${whatShouldBeDone}</p>
          </div>
        </div>
  
        <footer>
          <a href="https://msaatylaw.com/">ﻣﻜﺘﺐ اﻟﻤﺤﺎﻣﻲ ﻣﺤﻤﺪ ﺑﻦ ﺳﺎﻣﻲ ﺳﺎعاتي</a>
          <a href="mailto:info@msaatylaw.com">info@msaatylaw.com</a>
          <span>+966580033727</span>
        </footer>
  
        <aside>
          <hr />
          <b>بالتوفيق فيما هو قادم</b>
          <b>مع أطيب التمنيات</b>
        </aside>
      </body>
      </html>
    `;
    setIsloading(false);

    // Create a temporary div to hold the HTML content
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });

    // Create a File object from the Blob
    const file = new File([blob], "case-follow-up-report.html", {
      type: "text/html",
    });

    // Prepare FormData for the API request
    const formData = new FormData();
    formData.append("image", file); // Append the file to FormData

    try {
      // Upload the file
      const uploadResponse = await UploadImage(formData, lang); // Ensure UploadImage is an async function

      if (uploadResponse) {
        // Handle the response
        const fileId = uploadResponse.body.image_id; // Get the uploaded file ID
        setFileId(fileId); // Update state with the file ID

        // Prepare FormData for updating the case
        const updateFormData = { follow_up_reports: [fileId] };
        console.log(updateFormData);
        // Update the case with the file ID
        const updateResponse = await UpdateCases(updateFormData, caseId, lang);

        if (updateResponse?.body) {
          reToast.success(updateResponse.message); // Show success toast  setWhatShouldBeDone("");
          setFollowUpProcedures("");
          setNextDay("");
          setNextTime("");
          setNextDate("");
          setCurrentDay("");
          setCurrentTime("");
          setCurrentDate("");
          setDefendantName("");
          setPlaintiffName("");
          setCaseLocation("");
          setCaseName("");
          setCaseNumber("");
          setSelected("");
          setIsloading(true);
        } else {
          reToast.error(t("Failed to update case")); // Show failure toast
          setIsloading(true);
        }
      } else {
        reToast.error(t("Failed to upload file")); // Show failure toast
        setIsloading(true);
      }
    } catch (error) {
      // Handle errors that occur during the API call
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message

      // Check for specific error codes or messages
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }

      reToast.error(errorMessage); // Show error toast
      setIsloading(true);
    }

    // Download the HTML file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "case-follow-up-report.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // html2pdf()
    //   .set({
    //     margin: [10, 10, 10, 10], // Set margins
    //     filename: "case-follow-up-report.pdf", // Set the filename
    //     image: { type: "jpeg", quality: 0.98 }, // Set image quality
    //     html2canvas: { scale: 2 }, // Set scale for better quality
    //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // Set PDF format
    //   })
    //   .from(element)
    //   .save();

    // // Clean up the temporary div
    // element.remove();
  };
  const convertTo24Hour = (time12h: any) => {
    let [hours, minutes] = time12h.split(":");
    let ampm = time12h.slice(-2).toLowerCase();

    if (ampm === "pm" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (ampm === "am" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle> {t("Case follow-up report")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between">
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="my-4 font-bold"
          >
            {t("Case Details")}
          </motion.p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="Case">{t("Case Name")}</Label>
              <Input
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder={t("Enter Case Name")}
              />
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="CaseLocation">{t("Location of the case")}</Label>
              <Input
                type="text"
                value={caseLocation}
                onChange={(e) => setCaseLocation(e.target.value)}
                placeholder={t("Enter Location of the case")}
              />
            </motion.div>
            <motion.div
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="CaseNumber">{t("Case Number")}</Label>
              <Input
                type="number"
                placeholder={t("Enter Case Number")}
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
              />
            </motion.div>
            <motion.div
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="Plaintiff">{t("Plaintiff Name")}</Label>
              <Input
                type="text"
                value={plaintiffName}
                onChange={(e) => setPlaintiffName(e.target.value)}
                placeholder={t("Enter Plaintiff Name")}
              />
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="Defendant">{t("Defendant Name")}</Label>
              <Input
                type="text"
                value={defendantName}
                onChange={(e) => setDefendantName(e.target.value)}
                placeholder={t("Enter Defendant Name")}
              />
            </motion.div>
          </div>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3 }}
            className="my-3"
          />
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.4 }}
            className="my-4 font-bold"
          >
            {t("Date In Days And Hours")}
          </motion.p>
          <div className="flex flex-row justify-between items-center my-4 gap-5">
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col gap-2 w-[32%]"
            >
              <Label htmlFor="Date">{t("Date")}</Label>
              <CleaveInput
                id="date"
                options={{ date: true, datePattern: ["Y", "m", "d"] }}
                placeholder="YYYY-MM-DD"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.6 }}
              className="flex flex-col gap-2 w-[32%]"
            >
              <Label htmlFor="Time">{t("Time")}</Label>
              <Input
                type="time"
                placeholder="HH:MM" // Updated placeholder
                value={currentTime}
                onChange={(e) =>
                  setCurrentTime(convertTo24Hour(e.target.value))
                }
              />
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className="flex flex-col gap-2 w-[32%]"
            >
              <Label htmlFor="Days">{t("Day")}</Label>
              <BasicSelect
                selectedValue={currentDay}
                setSelectedValue={setCurrentDay}
                menu={Days}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.8 }}
            className="flex flex-col gap-2 my-2 w-[48%]"
          >
            <Label>{t("Appointment Status")} </Label>
            <ControlledRadio
              text1={t("There is an appointment")}
              setSelected={setSelected}
              selected={selected}
              text2={t("There is no appointment")}
            />
          </motion.div>
          {selected == "There is an appointment" || selected == "يوجد موعد" ? (
            <>
              {" "}
              <motion.p
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.9 }}
                className="my-4 font-bold"
              >
                {t("Next Appointmet")}
              </motion.p>
              <div className="flex flex-row justify-between my-4 items-center gap-5">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 2 }}
                  className="flex flex-col gap-2 w-[32%]"
                >
                  <Label htmlFor="Date">{t("Date")}</Label>
                  <CleaveInput
                    id="date"
                    options={{ date: true, datePattern: ["Y", "m", "d"] }}
                    placeholder="YYYY-MM-DD"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                  />
                </motion.div>
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 2.1 }}
                  className="flex flex-col gap-2 w-[32%]"
                >
                  <Label htmlFor="Time1">{t("Time")}</Label>
                  <Input
                    type="time"
                    placeholder="HH:MM" // Updated placeholder
                    value={nextTime}
                    onChange={(e) =>
                      setNextTime(convertTo24Hour(e.target.value))
                    }
                  />
                </motion.div>
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 2.2 }}
                  className="flex flex-col gap-2 w-[32%]"
                >
                  <Label htmlFor="Days">{t("Day")}</Label>
                  <BasicSelect
                    menu={Days}
                    selectedValue={nextDay}
                    setSelectedValue={setNextDay}
                  />
                </motion.div>
              </div>
            </>
          ) : null}
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.3 }}
            className="my-3"
          />
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2.4 }}
            className="my-4 font-bold"
          >
            {t("Necessary Procedures")}
          </motion.p>
          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2.5 }}
            className="flex flex-col gap-2 my-4"
          >
            <Label htmlFor="follow">{t("Follow-up procedures")}</Label>
            <Textarea
              placeholder={t("Type Here")}
              rows={7}
              value={followUpProcedures}
              onChange={(e) => setFollowUpProcedures(e.target.value)}
            />
          </motion.div>
          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2.6 }}
            className="flex flex-col gap-2 my-4"
          >
            <Label htmlFor="done">{t("What should be done?")}</Label>
            <Textarea
              placeholder={t("Type Here")}
              rows={7}
              value={whatShouldBeDone}
              onChange={(e) => setWhatShouldBeDone(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2.7 }}
            className="flex justify-center gap-3 mt-4"
          >
            <Button
              type="button"
              className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
              variant="outline"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              disabled={!loading}
              onClick={handleSubmit}
              className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
            >
              {!loading ? t("Loading") : t("Create Report")}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

const allowedRoles = ["lawyer"];

const ProtectedComponent = Auth({ allowedRoles })(CaseFollowReport);

export default ProtectedComponent;
