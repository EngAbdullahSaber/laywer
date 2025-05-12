"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import background from "@/public/images/auth/line.png";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ForgotForm from "./forgot-form";
import Logo from "@/public/images/auth/LawyerLogo.png";
import { motion } from "framer-motion";

const ForgotPage = () => {
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  return (
    <>
      <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex justify-center flex-col items-center"
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
            </motion.p>{" "}
            <motion.p
              initial={{ filter: "blur(20px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="!text-[#fdd472] text-center font-extrabold mt-7 text-3xl z-50 block"
              style={{
                color: "#fdd472",
                fontWeight: "800",
                fontSize: "34px",
              }}
            >
              The Law Firm of Mohammad S. Saaty
            </motion.p>
          </div>

          <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
            <div className="lg:w-[480px] ">
              <ForgotForm />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openVideo}>
        <DialogContent size="lg" className="p-0" hiddenCloseIcon>
          <Button
            size="icon"
            onClick={() => setOpenVideo(false)}
            className="absolute -top-4 -right-4 bg-default-900"
          >
            <X className="w-6 h-6" />
          </Button>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/8D6b3McyhhU?si=zGOlY311c21dR70j"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPage;
