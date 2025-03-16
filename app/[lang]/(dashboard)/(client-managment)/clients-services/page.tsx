"use client";

import React, { useEffect, useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import CreateDate from "./CreateDate";
import Image from "next/image";
import card6 from "@/public/images/card/card6.jpg";
import { useParams } from "next/navigation";
import { getServices } from "@/services/services/services";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const [data, setData] = useState<any>([]);

  const getCourtData = async () => {
    setLoading(true);
    try {
      const res = await getServices(lang);

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
          <div className="text-default-900 text-2xl font-bold my-2">
            {t("Services")}
          </div>
          <BreadcrumbComponent header={"Services"} body={"Services List"} />
        </motion.div>
      </div>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {data.map((item: any) => {
          return (
            <Card key={item.id}>
              <CardContent className="p-0">
                <div className="w-full h-[191px] bg-muted-foreground overflow-hidden rounded-t-md">
                  <Image
                    className="w-full h-full object-cover"
                    src={item?.service_file?.url || card6} // Fallback to card6 image if no URL is available
                    alt="service image"
                    width={500} // Set width and height for optimal rendering
                    height={191}
                  />
                </div>

                <div className="p-4">
                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-2 text-lg text-default-700 font-medium"
                  >
                    اسم الخدمة <span className="font-bold">{item?.title}</span>
                  </motion.p>

                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-muted-foreground text-sm"
                  >
                    تفاصيل الخدمة :{" "}
                    <span className="font-bold">{item?.description}</span>
                  </motion.p>

                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="font-semibold text-base text-[#1A1A1A] dark:text-slate-400"
                  >
                    سعر الخدمة{" "}
                    <span className="font-bold">{item?.price} SAR</span>
                  </motion.p>
                </div>

                <div className="p-4 flex justify-end">
                  <CreateDate id={item.id} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const allowedRoles = ["client"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
