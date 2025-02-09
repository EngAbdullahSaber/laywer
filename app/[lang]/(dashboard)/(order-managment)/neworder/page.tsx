"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";

import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import CreateDate from "./CreateDate";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const page = () => {
  const { t, loading, error } = useTranslate();

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

          <Card className="my-4">
            <div className="flex flex-row  !flex-nowrap justify-between items-center p-4 rounded-xl my-3">
              <div className="flex flex-col gap-3 justify-between items-start">
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-bold text-xl  text-[#1A1A1A] dark:text-slate-400"
                >
                  اريد ان احجز قضية جديدة
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  اسم العميل : <span className="font-bold">احمد على</span>
                </motion.p>

                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  الرقم التعريفى للعميل :{" "}
                  <span className="font-bold"> 68786</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  الرقم التعريفى للطلب :{" "}
                  <span className="font-bold"> 68786</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  الحالة : <span className="font-bold"> تم الرد</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.1 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  العنوان <span className="font-bold">الرياض</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  تاريح الارسال:{" "}
                  <span className="font-bold">September 12, 2024 </span>
                </motion.p>
              </div>
              <div className="flex flex-col justify-center items-center gap-6">
                {" "}
              </div>
            </div>
          </Card>
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

          <Card className="my-4">
            <div className="flex flex-row  !flex-wrap justify-between items-center p-4 rounded-xl my-3">
              <div className="flex flex-col gap-3 justify-between items-start">
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-bold text-xl  text-[#1A1A1A] dark:text-slate-400"
                >
                  اريد ان احجز قضية جديدة
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  اسم العميل : <span className="font-bold">احمد على</span>
                </motion.p>

                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  الرقم التعريفى للعميل :{" "}
                  <span className="font-bold"> 68786</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  الرقم التعريفى للطلب :{" "}
                  <span className="font-bold"> 68786</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  {" "}
                  الحالة : <span className="font-bold"> تم الرد</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.1 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  العنوان <span className="font-bold">الرياض</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  تاريح الارسال:{" "}
                  <span className="font-bold">September 12, 2024 </span>
                </motion.p>
              </div>
              <div className="flex flex-col justify-center items-center gap-6">
                {" "}
                <CreateDate />
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default page;
