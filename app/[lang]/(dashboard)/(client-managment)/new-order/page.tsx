"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import CreateDate from "./CreateDate";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { getOrders } from "@/services/new-orders/new-orders";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const [data, setData] = useState<any>([]);

  const getCourtData = async () => {
    setLoading(true);

    try {
      const res = await getOrders(lang);
      setData(res?.body?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourtData();
  }, []);
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
            {t("Messages List")}
          </div>{" "}
          <BreadcrumbComponent header={"Messages"} body={"Messages List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {" "}
          <CreateDate getCourtData={getCourtData} />
        </motion.div>
      </div>

      {data.map((item: any, index: number) => {
        // Use a parameter for each item (and index if needed)
        return (
          <Card className="my-4" key={index}>
            {" "}
            {/* Ensure to add a unique 'key' for each mapped item */}
            <div className="flex flex-row !flex-nowrap justify-between items-center p-4 rounded-xl my-3">
              <div className="flex flex-col gap-3 justify-between items-start">
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-bold text-xl text-[#1A1A1A] dark:text-slate-400"
                >
                  {item?.message}{" "}
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="font-semibold text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  الرد : <span className="font-bold"> {item?.reply}</span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="font-semibold text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  تم الرد من قبل :{" "}
                  <span className="font-bold"> {item?.reply_from?.name}</span>
                </motion.p>

                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="font-semibold text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  تاريح الارسال:{" "}
                  <span className="font-bold">
                    {new Date(item?.created_at).toLocaleDateString("en-GB")}{" "}
                  </span>
                </motion.p>
                <motion.p
                  initial={{ x: 15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.4 }}
                  className="font-semibold text-base text-[#1A1A1A] dark:text-slate-400"
                >
                  تاريح المقابلة :{" "}
                  <span className="font-bold">{item?.meeting_date} </span>
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
  );
};

const allowedRoles = ["client"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
