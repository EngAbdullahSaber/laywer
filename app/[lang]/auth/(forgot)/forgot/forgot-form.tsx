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
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import Logo from "@/public/images/auth/LawyerLogo.png";
import Image from "next/image";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
});
const ForgotForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = (data: any) => {
    startTransition(async () => {
      toast.success(
        "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
      );
      reset();
      router.push("/auth/verify");
    });
  };
  const { t, loading, error } = useTranslate();

  return (
    <div className="w-full">
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {" "}
        <Image
          src={Logo}
          height={56}
          width={56}
          alt="logo"
          className="w-14 h-14"
          priority={true}
        />
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
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
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
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
          {errors.email && (
            <div className=" text-destructive mt-2">
              {errors.email.message as string}
            </div>
          )}
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
