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
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useMediaQuery } from "@/hooks/use-media-query";
import Logo from "@/public/images/auth/LawyerLogo.png";
import Image from "next/image";
import { AxiosError } from "axios";
import { CreateNewPassword } from "@/services/auth/auth";
import { useTranslate } from "@/config/useTranslation";
interface ErrorResponse {
  errors?: {
    [key: string]: string[];
  };
}

const CreatePasswordForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [newPasswordType, setNewPasswordType] = React.useState<boolean>(false);
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [confirmPasswordType, setConfirmPasswordType] =
    React.useState<boolean>(false);
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const { t } = useTranslate();

  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const tokenOtp = localStorage.getItem("forgetToken1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send username and OTP to the API
      const res = await CreateNewPassword(
        {
          password: newPassword,
          password_confirmation: confirmPassword, // Send OTP as a string
        },
        {
          headers: {
            Authorization: `Bearer ${tokenOtp}`, // Set token in the Authorization header
          },
        }
      );
      toast.success(res?.message);
      router.push("/auth/login");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Check if we have errors in the response
      const errors = axiosError.response?.data?.errors;
      if (errors) {
        // Loop through each field in the errors object
        for (const field in errors) {
          if (Object.prototype.hasOwnProperty.call(errors, field)) {
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

  return (
    <div className="w-full">
      {/* <Image
        src={Logo}
        height={56}
        width={56}
        alt="logo"
        className="w-14 h-14"
        priority={true}
      /> */}
      <div className="2xl:mt-8 mt-6 2xl:text-3xl lg:text-2xl text-xl font-bold text-default-900">
        {t("Create New Password")}
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        {t("Enter your password to unlock the screen!")}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600"
            >
              {t("Password")}
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                type={newPasswordType ? "text" : "password"}
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                size={!isDesktop2xl ? "xl" : "lg"}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={() => setNewPasswordType(!newPasswordType)}
              >
                {newPasswordType ? (
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
          </div>
          <div>
            <Label
              htmlFor="confirmPassword"
              className="mb-2 font-medium text-default-600"
            >
              {t("Confirm Password")}
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                type={confirmPasswordType ? "text" : "password"}
                id="confirmPassword"
                size={!isDesktop2xl ? "xl" : "lg"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={() => setConfirmPasswordType(!confirmPasswordType)}
              >
                {confirmPasswordType ? (
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
          </div>
        </div>

        <Button className="w-full mt-8" size="lg">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t("Resetting...") : t("Reset Password")}
        </Button>
      </form>
    </div>
  );
};

export default CreatePasswordForm;
