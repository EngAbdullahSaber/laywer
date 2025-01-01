"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";

import { motion } from "framer-motion";
import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import CreateDate from "./CreateDate";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <motion.div
          initial={{ x: 15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
        >
          {" "}
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Services")}
          </div>{" "}
          <BreadcrumbComponent header={"Services"} body={"Services List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {" "}
        </motion.div>
      </div>

      <Card className="my-4">
        <div className="flex flex-row  !flex-nowrap justify-between items-center p-4 rounded-xl my-3">
          <div className="flex flex-col gap-3 justify-between items-start w-[75%]">
            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="font-bold text-xl  text-[#1A1A1A] dark:text-slate-400"
            >
              اسم الخدمة <span className="font-bold">خدمة 1 </span>
            </motion.p>
            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
            >
              {" "}
              تفاصيل الخدمة :{" "}
              <span className="font-bold">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </span>
            </motion.p>

            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400"
            >
              سعر الخدمة <span className="font-bold"> 120 SAR</span>
            </motion.p>
          </div>
          <div className="flex flex-col justify-start flex-wrap items-end gap-6 w-[75%]">
            {" "}
            <CreateDate />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default page;
