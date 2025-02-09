"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import background from "@/public/images/auth/line.png";
import logo from "../../../../../components/svg/home/Logo.png";
import { X } from "lucide-react";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import LogInForm from "@/components/auth/login-form";
import Logo from "@/public/images/auth/LawyerLogo.png";
import RegForm from "./reg-form";
const LoginPage = () => {
  console.log(logo);
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  return (
    <Fragment>
      <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex  flex-col justify-center items-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #31291E 0%, #000080 100%)",
            }}
          >
            <Image
              src={background}
              alt="image"
              className="absolute top-0 left-0 w-full h-full "
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <Image
                src={Logo}
                height={320}
                width={384}
                alt="logo"
                className="w-96 h-80 block"
                priority={true}
              />
            </motion.div>{" "}
            <motion.p
              initial={{ filter: "blur(20px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="!text-[#fdd472] text-center font-extrabold text-3xl z-50 block"
              style={{
                color: "#fdd472",
                fontWeight: "800",
                fontSize: "34px",
              }}
            >
              ﻣﻜﺘﺐ اﻟﻤﺤﺎﻣﻲ ﻣﺤﻤﺪ ﺑﻦ ﺳﺎﻣﻲ ﺳﺎعاتي
            </motion.p>
          </div>

          <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
            <div className="lg:w-[480px] ">
              <RegForm />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
