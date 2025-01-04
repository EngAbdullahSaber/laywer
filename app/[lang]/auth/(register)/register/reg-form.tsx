"use client";
import React, { useState } from "react";
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
import { addUser } from "@/action/auth-action";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import googleIcon from "@/public/images/auth/google.png";
import facebook from "@/public/images/auth/facebook.png";
import apple from "@/public/images/auth/apple.png";
import Logo from "@/public/images/auth/LawyerLogo.png";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { websiteName } from "@/config/constants";
import { useTranslate } from "@/config/useTranslation";

const schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Your email is invalid." }),
  phone: z
    .string()
    .min(3, { message: "phone must be at least 11 characters." }),
  password: z.string().min(4),
});
const RegForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState<string>("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };
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
  const { t, loading, error } = useTranslate();

  const onSubmit = (data: any) => {
    startTransition(async () => {
      let response = await addUser(data);
      if (response?.status === "success") {
        toast.success(response?.message);
        reset();
        router.push("/");
      } else {
        toast.error(response?.message);
      }
    });
  };
  return (
    <div className="w-full">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
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
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        {t("Hey, Hello 👋")}
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        {t("Create account to start using msaatylaw dashboard")}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-2 font-medium text-default-600">
              {t("Full Name")}{" "}
            </Label>
            <Input
              disabled={isPending}
              {...register("name")}
              type="text"
              id="name"
              className={cn("", {
                "border-destructive": errors.name,
              })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.name && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.name.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="email"
              className="mb-2 font-medium text-default-600"
            >
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
              <div className=" text-destructive mt-2 mb-4">
                {errors.email.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="mb-2 font-medium text-default-600"
            >
              {t("Phone Number")}{" "}
            </Label>
            <Input
              disabled={isPending}
              {...register("phone")}
              type="phone"
              id="phone"
              className={cn("", {
                "border-destructive": errors.phone,
              })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.phone && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.phone.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600"
            >
              {t("Password")}{" "}
            </Label>
            <div className="relative">
              <Input
                type={passwordType}
                id="password"
                size={!isDesktop2xl ? "xl" : "lg"}
                disabled={isPending}
                {...register("password")}
                className={cn("", {
                  "border-destructive": errors.password,
                })}
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
            {errors.password && (
              <div className=" text-destructive mt-2">
                {errors.password.message as string}
              </div>
            )}
          </div>
        </div>
        {/* <div className="mt-5 flex items-center gap-1.5 mb-8">
          <Checkbox
            size="sm"
            className="border-default-300 mt-[1px]"
            id="terms"
          />
          <Label
            htmlFor="terms"
            className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
          >
            You accept our Terms & Conditions
          </Label>
        </div> */}
        <Button
          className="w-full my-3"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t("Registering") : t("Create an Account")}
        </Button>
      </form>
      {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent"
        >
          <Image src={googleIcon} alt="google icon" className="w-6 h-6" priority={true} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
        >
          <Image src={facebook} alt="google icon" className="w-6 h-6" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent"
        >
          <Image src={apple} alt="google icon" className="w-6 h-6" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent"
        >
          <Image src={twitter} alt="google icon" className="w-6 h-6" />
        </Button>
      </div>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        Already Registered?{" "}
        <Link href="/auth/login" className="text-primary">
          Sign In
        </Link> */}
      {/* </div> */}
    </div>
  );
};

export default RegForm;
