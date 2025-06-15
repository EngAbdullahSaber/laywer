"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import {
  getNotReplyedMessages,
  getReplyedMessages,
} from "@/services/messages/messages";
import { Auth } from "@/components/auth/Auth";
import CreateDate from "./CreateDate";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const [replyedMessages, setReplyedMessages] = useState<any>([]);
  const [flag, setFlag] = useState<any>([]);
  const [notReplyedMessages, setNotReplyedMessages] = useState<any>([]);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);

  const getMessagesData = async () => {
    setLoading(true);
    try {
      const res1 = await getNotReplyedMessages(lang);
      const res = await getReplyedMessages(lang);
      setReplyedMessages(res?.body?.data || []);
      setNotReplyedMessages(res1?.body?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const accessToken = useAccessToken();
  if (accessToken) {
    updateAxiosHeader(accessToken);
  }
  const getServicesData = async () => {
    try {
      const res = await getAllRoles(lang);

      const roles = Array.isArray(res?.body?.roles_and_permissions)
        ? res.body.roles_and_permissions.filter(
            (role: any) => role.role !== "client" && role.role !== "lawyer"
          )
        : [];

      setAllowedRoles(["super_admin", ...roles.map((r: any) => r.role)]);
    } catch (error: any) {
      const message = error?.response?.data?.message;
      const status = error?.response?.status;

      if (status === 401) {
        // if (message === "please login first") {
        //   console.warn("User not authenticated, redirecting to login...");
        //   clearAuthInfo();
        //   window.location.replace("/auth/login");
        // } else if (message === "Unauthorized" || message === "غير مصرح") {
        //   console.warn("User unauthorized, redirecting to 403 page...");
        //   window.location.replace("/error-page/403");
        // }
      } else {
        console.error("An unexpected error occurred:", error);
        // You can add a fallback or show a toast here if needed
      }
    }
  };

  useEffect(() => {
    getServicesData();
    getMessagesData();
  }, [flag, lang]);

  // Loading state while allowedRoles is being fetched
  if (!allowedRoles) {
    return; // Or <Loading />
  }

  if (!allowedRoles) {
    return null; // Or a loading component
  }
  console.log(notReplyedMessages);
  console.log(replyedMessages);
  const ProtectedPage = Auth({ allowedRoles })(() => (
    <Tabs defaultValue="Answered" className="">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-20 sm:h-12">
        <TabsTrigger value="Answered">{t("Quiestions Answered")}</TabsTrigger>
        <TabsTrigger value="NotAnswered">
          {t("Quiestions Not Answered")}
        </TabsTrigger>
      </TabsList>

      <div className="space-y-5">
        <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
          <motion.div
            initial={{ x: 15 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="text-default-900 text-2xl font-bold my-2">
              {t("Messages")}
            </div>
            <BreadcrumbComponent header={"Inquiries"} body={"Messages"} />
          </motion.div>
        </div>

        <TabsContent value="Answered">
          {replyedMessages.map((item: any, index: number) => (
            <Card className="my-4" key={index}>
              <div className="flex flex-row !flex-nowrap justify-between items-center p-4 rounded-xl my-3">
                <div className="flex flex-col gap-3 justify-between items-start">
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="font-bold text-xl text-[#1A1A1A] dark:text-white"
                  >
                    {item?.message}
                  </motion.p>
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    الرد: <span className="font-bold">{item?.reply}</span>
                  </motion.p>

                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    اسم العميل:{" "}
                    <span className="font-bold">{item?.sent_from?.name}</span>
                  </motion.p>
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.9 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    الرقم التعريفى للعميل:{" "}
                    <span className="font-bold">{item?.sent_from?.id}</span>
                  </motion.p>
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    الحالة: <span className="font-bold">تم الرد</span>
                  </motion.p>

                  {item?.meeting_date && (
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.1 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      تاريح المقابلة مع المحامى:{" "}
                      <span className="font-bold">{item?.meeting_date}</span>
                    </motion.p>
                  )}

                  {item?.meeting_time && (
                    <motion.p
                      initial={{ x: 15, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                    >
                      وقت المقابلة:{" "}
                      <span className="font-bold">
                        {item?.meeting_time?.substring(0, 5)}
                      </span>
                    </motion.p>
                  )}

                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    تاريخ الارسال:{" "}
                    <span className="font-bold">
                      {new Date(item?.created_at).toLocaleDateString("en-GB")}
                    </span>
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
                    </span>
                  </motion.p>
                </div>
                <div className="flex flex-col justify-center items-center gap-6">
                  {/* Add any other content here */}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="NotAnswered">
          {notReplyedMessages.map((item: any, index: number) => (
            <Card className="my-4" key={index}>
              <div className="flex flex-row !flex-wrap justify-between items-center p-4 rounded-xl my-3">
                <div className="flex flex-col gap-3 justify-between items-start">
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="font-bold text-xl text-[#1A1A1A] dark:text-white"
                  >
                    {item?.message}
                  </motion.p>
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    اسم العميل:{" "}
                    <span className="font-bold">{item?.sent_from?.name}</span>
                  </motion.p>

                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    الرقم التعريفى للعميل:{" "}
                    <span className="font-bold">{item?.sent_from?.id}</span>
                  </motion.p>
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.9 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    الرقم التعريفى للطلب:{" "}
                    <span className="font-bold">{item?.id}</span>
                  </motion.p>
                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    الحالة: <span className="font-bold">لم يتم الرد</span>
                  </motion.p>

                  <motion.p
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-white"
                  >
                    تاريخ الارسال:{" "}
                    <span className="font-bold">
                      {new Date(item?.created_at).toLocaleDateString("en-GB")}
                    </span>
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
                    </span>
                  </motion.p>
                </div>
                <div className="flex flex-col justify-center items-center gap-6">
                  {permission
                    .find((item: any) => item.id === 3 || item.id === 129)
                    ?.permissions?.some(
                      (perm: any) => perm.id === 5 || perm.id === 131
                    ) && (
                    <CreateDate flag={flag} setFlag={setFlag} id={item.id} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </div>
    </Tabs>
  ));

  return <ProtectedPage />;
};

export default PageWithAuth;
