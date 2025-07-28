"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Logo from "@/public/images/auth/LawyerLogo.png";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslate } from "@/config/useTranslation";
import { setPhoneTokens, setUserName } from "../../store/Action";
import { LogIn } from "@/services/auth/auth";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
interface ErrorResponse {
  errors?: {
    [key: string]: string[]; // This allows us to map error fields to an array of error messages
  };
}
const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const { lang } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await LogIn(
        {
          email: email,
          device_name: email,
          password: password,
        },
        lang
      );
      if (res) {
        toast.success(res?.message);
        startTransition(true);
        // storeTokenInLocalStorage(res?.body?.verify_user_token);
        dispatch(setUserName(email));
        dispatch(setPhoneTokens(res?.body?.verify_user_token));
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        router.push("/auth/verify");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; // Cast the error

      // Check if we have errors in the response
      const errors = axiosError.response?.data?.errors;
      if (errors) {
        // Loop through each field in the errors object
        for (const field in errors) {
          if (Object.prototype.hasOwnProperty.call(errors, field)) {
            // Assuming the first error in the array is the most important one
            const errorMessage = errors[field][0];
            toast.error(`${field}: ${errorMessage}`); // Display the error in a toast
          }
        }
      } else {
        // If no field-specific errors, display a general error message
        toast.error("Something went wrong.");
      }
    }
  };

  const { t } = useTranslate();

  return (
    <div className="w-full py-10 ">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {" "}
        {/* <Image
          src={Logo}
          height={56}
          width={56}
          alt="logo"
          className="w-14 h-14"
          priority={true}
        /> */}
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6"
      >
        {t("Enter the information you entered while registering")}
      </motion.div>
      <form className="mt-5 2xl:mt-7" onSubmit={handleSubmit}>
        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            {t("Email")}{" "}
          </Label>
          <Input
            disabled={isPending}
            type="text"
            id="email"
            className=""
            size={!isDesktop2xl ? "xl" : "lg"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="mt-3.5"
        >
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            {t("Password")}{" "}
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}
            >
              {passwordType === "password" ? (
                <Icon
                  icon="heroicons:eye"
                  className="w-5 h-5 text-default-400"
                />
              ) : (
                <Icon
                  icon="heroicons:eye-slash"
                  className="w-5 h-5 text-default-400"
                />
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-5  mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex  items-center gap-1.5 ">
            {/* <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Remember me
            </Label> */}
          </div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.6 }}
          >
            <Link
              href="/auth/forgot"
              className="flex-none text-sm text-primary"
            >
              {t("Forget Password?")}
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8 }}
        >
          <Button
            className="w-full"
            disabled={isPending}
            size={!isDesktop2xl ? "lg" : "md"}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t("Loading") : t("Sign In")}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default LogInForm;
