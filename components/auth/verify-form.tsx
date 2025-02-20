"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/auth/LawyerLogo.png";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { VerifyLogin } from "@/services/auth/auth";
import { headerConfigKeyName } from "@/services/app.config";
import { storeTokenInLocalStorage } from "@/services/utils";

interface ErrorResponse {
  errors?: {
    [key: string]: string[];
  };
}

interface RootState {
  userName: string;
}
interface RootState1 {
  accessToken: string;
}
const VerifyForm = () => {
  const totalOtpField = 6; // Total number of OTP fields
  const otpArray: string[] = Array.from({ length: totalOtpField }, () => "");
  const [otp, setOtp] = useState<string[]>(otpArray);
  const otpFields = Array.from({ length: totalOtpField }, (_, index) => index);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userName);
  const tokenOtp = useSelector((state: RootState1) => state.accessToken);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value.length === 1 && index < totalOtpField - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index - 1] = "";
        return newOtp;
      });
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < totalOtpField - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join(""); // Join OTP array into a string
    setOtp(otpArray); // Reset OTP input

    try {
      // Send username and OTP to the API
      const res = await VerifyLogin(
        {
          email: username,
          code: enteredOtp, // Send OTP as a string
        },
        {
          headers: {
            Authorization: `Bearer ${tokenOtp}`, // Set token in the Authorization header
          },
        }
      );
      if (res) {
        // Check if the response has a valid message
        if (res?.message) {
          toast.success(res.message);
        }
      
        // Ensure the access_token exists before trying to store it
        if (res?.body?.access_token) {
          storeTokenInLocalStorage(res.body.access_token);
        } else {
          toast.error("Access token missing");
          return;
        }
      
        // Ensure the user and role information exists before using it
        const userRole = res?.body?.user?.role_with_permission?.name;
        localStorage.setItem("role",userRole);
        if (userRole) {
          // Redirect based on role
          if (userRole == "super_admin") {
            router.push("/dashboard");
          } else if (userRole == "lawyer") {
            router.push("/lawyer-cases");
          } else if (userRole == "client") {
            router.push("/client-cases");
          } else {
            toast.error("Unknown role");
          }
        } else {
          toast.error("User role information is missing");
        }
      } else {
        toast.error("Response is invalid or missing");
      }
      
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

  const isOtpComplete = otp.every((digit) => digit !== "");
  const { t } = useTranslate();

  return (
    <div className="w-full md:w-[480px] py-5">
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.2 }}
      >
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
        transition={{ duration: 1.2 }}
        className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900"
      >
        {t("Two Factor Verification")}
      </motion.div>
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.2 }}
        className="2xl:text-lg text-base text-default-600 mt-2 leading-6"
      >
        {t("Enter the 6 figure confirmation code sent to your email")}
      </motion.div>
      <form className="mt-8">
        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex flex-wrap gap-1 lg:gap-6"
        >
          {otpFields.map((index) => (
            <Input
              key={`otp-code-${index}`}
              type="text"
              id={`otp${index}`}
              name={`otp${index}`}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              maxLength={1}
              className="w-10 h-10 sm:w-[60px] sm:h-16 rounded border-default-300 text-center text-2xl font-medium text-default-900"
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-6"
        >
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!isOtpComplete}
          >
            {t("Verify Now")}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default VerifyForm;
