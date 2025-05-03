"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";

import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import CreateDate from "./CreateDate";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import {
  getNotReplyedMessages,
  getReplyedMessages,
} from "@/services/messages/messages";
import { Auth } from "@/components/auth/Auth";
const page = () => {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const [replyedMessages, setReplyedMessages] = useState<any>([]);
  const [flag, setFlag] = useState<any>([]);
  const [notReplyedMessages, setNotReplyedMessages] = useState<any>([]);
  const permission = JSON.parse(localStorage.getItem("permissions"));

  const getMessagesData = async () => {
    setLoading(true);

    try {
      const res = await getReplyedMessages(lang);
      const res1 = await getNotReplyedMessages(lang);
      console.log(res?.body?.data);
      setReplyedMessages(res?.body?.data || []);
      setNotReplyedMessages(res1?.body?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    getMessagesData();
  }, [flag]);
  return (
    <Tabs defaultValue="Answered" className="">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-20  sm:h-12">
        <TabsTrigger value="Answered">{t("Quiestions Answered")}</TabsTrigger>
        <TabsTrigger value="NotAnswered">
          {t("Quiestions Not Answered")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Answered">
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <div>
              <motion.div
                initial={{ x: 15 }}
                whileInView={{ x: 0 }}
                transition={{ duration: 1.2 }}
                className=" text-default-900 text-2xl font-bold my-2"
              >
                {t("New Orders")}
              </motion.div>

              <BreadcrumbComponent header={"Inquiries"} body={"New Orders"} />
            </div>
            <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"></div>
          </div>

          {replyedMessages.map((item: any, index: number) => {
            return (
              <Card className="my-4" key={index}>
                <div className="flex flex-row !flex-nowrap justify-between items-center p-4 rounded-xl my-3">
                  <div className="flex flex-col gap-3 justify-between items-start">
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="font-bold text-xl text-[#1A1A1A] dark:text-white"
                    >
                      {item?.message}{" "}
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الرد : <span className="font-bold"> {item?.reply}</span>
                    </motion.p>

                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الرقم التعريفى للعميل :{" "}
                      <span className="font-bold"> 68786</span>
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.9 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الرقم التعريفى للطلب :{" "}
                      <span className="font-bold"> {item?.id}</span>
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الحالة : <span className="font-bold"> تم الرد</span>
                    </motion.p>

                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.1 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      تاريح المقابلة مع المحامى:{" "}
                      <span className="font-bold">{item?.meeting_date} </span>
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      وقت المقابلة:{" "}
                      <span className="font-bold">
                        {item?.meeting_time?.substring(0, 5)}{" "}
                      </span>{" "}
                    </motion.p>

                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      تاريخ الارسال:{" "}
                      <span className="font-bold">
                        {new Date(item?.created_at).toLocaleDateString("en-GB")}{" "}
                      </span>{" "}
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      وقت الارسال:{" "}
                      <span className="font-bold">
                        {new Date(item?.created_at)
                          .toISOString()
                          .split("T")[1]
                          .split(":")
                          .slice(0, 2)
                          .join(":")}
                      </span>{" "}
                    </motion.p>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-6">
                    {/* Add any other content here */}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </TabsContent>
      <TabsContent value="NotAnswered">
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <div>
              <motion.div
                initial={{ x: 15 }}
                whileInView={{ x: 0 }}
                transition={{ duration: 1.2 }}
                className=" text-default-900 text-2xl font-bold my-2"
              >
                {t("New Orders")}
              </motion.div>

              <BreadcrumbComponent header={"Inquiries"} body={"New Orders"} />
            </div>
            <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"></div>
          </div>

          {notReplyedMessages.map((item: any, index: number) => {
            return (
              <Card className="my-4" key={index}>
                <div className="flex flex-row !flex-wrap justify-between items-center p-4 rounded-xl my-3">
                  <div className="flex flex-col gap-3 justify-between items-start">
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="font-bold text-xl text-[#1A1A1A] dark:text-white"
                    >
                      {item?.message}{" "}
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      اسم العميل : <span className="font-bold">احمد على</span>
                    </motion.p>

                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الرقم التعريفى للعميل :{" "}
                      <span className="font-bold"> 68786</span>
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.9 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الرقم التعريفى للطلب :{" "}
                      <span className="font-bold"> {item?.id}</span>
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      الحالة : <span className="font-bold"> لم يتم الرد</span>
                    </motion.p>

                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      تاريخ الارسال:{" "}
                      <span className="font-bold">
                        {new Date(item?.created_at).toLocaleDateString("en-GB")}{" "}
                      </span>{" "}
                    </motion.p>
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      وقت الارسال:{" "}
                      <span className="font-bold">
                        {new Date(item?.created_at)
                          .toISOString()
                          .split("T")[1]
                          .split(":")
                          .slice(0, 2)
                          .join(":")}
                      </span>{" "}
                    </motion.p>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-6">
                    {/* Pass correct props for CreateDate */}
                    {permission
                      .find((item: any) => item.id === 3)
                      .permissions.some((item: any) => item.id === 5) && (
                      <CreateDate flag={flag} setFlag={setFlag} id={item.id} />
                    )}
                    {/* Assuming `flag` and `setFlag` are part of `item` */}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
};

const allowedRoles = ["super_admin", "admin", "secretary"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
