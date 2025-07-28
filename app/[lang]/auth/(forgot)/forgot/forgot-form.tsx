"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import Logo from "@/public/images/auth/LawyerLogo.png";
import Image from "next/image";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { ForgetPassword1 } from "@/services/auth/auth";
interface ErrorResponse {
  errors?: {
    [key: string]: string[]; // This allows us to map error fields to an array of error messages
  };
}
const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
});
const ForgotForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const [email, setEmail] = React.useState("");
  const { lang } = useParams();

  const router = useRouter();

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await ForgetPassword1(
        {
          email: email,
        },
        lang
      );
      if (res) {
        toast.success(res?.message);
        startTransition(true);
        localStorage.setItem("forgetToken1", res?.body?.token);
        localStorage.setItem("email", email);

        router.push("/auth/verifyPassword");
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
    <div className="w-full">
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
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
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900"
      >
        {t("Forget Your Password?")}
      </motion.div>
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1 }}
        className="2xl:text-lg text-base text-default-600 mt-2 leading-6"
      >
        {t("Enter your email & instructions will be sent to you!")}
      </motion.div>
      <form onSubmit={handleSubmit} className="mt-5 xl:mt-7">
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
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
        </motion.div>

        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.4 }}
        >
          {" "}
          <Button className="w-full mt-6" size={!isDesktop2xl ? "lg" : "md"}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t("sending") : t("Send Recovery Email")}
          </Button>
        </motion.div>
      </form>
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.6 }}
        className="mt-5 2xl:mt-8  text-center text-base text-default-600"
      >
        {t("Forget it Send me back to")}{" "}
        <Link href="/auth/login" className="text-primary">
          {t("Sign In")}
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotForm;
