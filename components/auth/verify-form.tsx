"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/auth/LawyerLogo.png";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { LogIn, VerifyLogin } from "@/services/auth/auth";
import { headerConfigKeyName } from "@/services/app.config";
import { storeTokenInLocalStorage } from "@/services/utils";
import { changeUserData, setPhoneTokens } from "@/store/Action";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";
import LayoutLoader from "../layout-loader";

interface ErrorResponse {
  errors?: {
    [key: string]: string[];
  };
}

interface RootState {
  userName: string;
}
interface RootState1 {
  phoneToken: string;
}

const VerifyForm = ({
  loading,
  setLoading,
}: {
  loading: any;
  setLoading: any;
}) => {
  const totalOtpField = 6;
  const otpArray: string[] = Array.from({ length: totalOtpField }, () => "");
  const [otp, setOtp] = useState<string[]>(otpArray);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  const otpFields = Array.from({ length: totalOtpField }, (_, index) => index);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { lang } = useParams();

  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.userName);
  const tokenOtp = useSelector((state: RootState1) => state.phoneToken);
  const accessToken = useAccessToken();

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

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
    const enteredOtp = otp.slice().join("");
    setOtp(otpArray);
    setLoading(false);

    try {
      const res = await VerifyLogin(
        {
          email: username,
          code: enteredOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenOtp}`,
          },
        }
      );

      if (res) {
        if (res?.message) {
          toast.success(res.message);
        }

        if (res?.body?.access_token) {
          dispatch(
            changeUserData({
              email: res.body.user.email,
              role_with_permission: res.body.user?.role,
              roleId: res.body.user?.role_with_permission?.id,
              verify_access_token: res.body.user.verify_access_token,
            })
          );
          localStorage.setItem(
            "permissions",
            JSON.stringify(res?.body?.user?.role_with_permission?.permissions)
          );

          if (res.body.user?.role) {
            if (res.body.user?.role == "lawyer") {
              router.replace("/lawyer-cases");
            } else if (res.body.user?.role == "client") {
              router.replace("/client-cases");
            } else {
              router.replace("/dashboard");
            }
          } else {
            toast.error("User role information is missing");
          }
        } else {
          toast.error("Access token missing");
          return;
        }
      } else {
        toast.error("Response is invalid or missing");
      }
      setLoading(true);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const response = axiosError.response?.data;

      const message = response?.message;
      const errors = response?.errors;

      // Always show fallback toast
      if (!message && !errors) {
        toast.error("Something went wrong.");
        return;
      }

      // Show message
      if (message) {
        if (message === "please login first") {
          toast.error(t("enteredcode not valid"));
        } else {
          toast.error(message);
        }
      }

      // Show field-level errors if present
      if (errors && typeof errors === "object") {
        for (const field in errors) {
          if (Object.prototype.hasOwnProperty.call(errors, field)) {
            const errorMsg = Array.isArray(errors[field])
              ? errors[field][0]
              : errors[field];
            toast.error(`${field}: ${errorMsg}`);
          }
        }
      }
    }
  };

  const handleResendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const email1 = localStorage.getItem("email");
    const password1 = localStorage.getItem("password");

    try {
      const res = await LogIn(
        {
          email: email1,
          device_name: email1,
          password: password1,
        },
        lang
      );

      if (res) {
        toast.success("New verification code sent!");
        dispatch(setPhoneTokens(res?.body?.verify_user_token));
        // Reset timer
        setTimeLeft(300);
        setIsTimerActive(true);
        // Clear OTP fields
        setOtp(otpArray);
        // Focus first input
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errors = axiosError.response?.data?.errors;

      if (errors) {
        for (const field in errors) {
          if (Object.prototype.hasOwnProperty.call(errors, field)) {
            const errorMessage = errors[field][0];
            toast.error(`${field}: ${errorMessage}`);
          }
        }
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const { t } = useTranslate();

  useEffect(() => {
    if (accessToken) {
      updateAxiosHeader(accessToken);
    }
  }, [accessToken]);

  if (loading) {
    return <LayoutLoader />;
  }

  return (
    <div className="w-full md:w-[480px] py-5">
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.2 }}
      >
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

      {/* Timer display */}
      <motion.div
        initial={{ y: -50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.2 }}
        className="mt-4 text-center text-lg font-medium"
      >
        {isTimerActive ? (
          <span>
            {t("Time remaining")}: {formatTime(timeLeft)}
          </span>
        ) : (
          <span className="text-red-500">{t("Verification code expired")}</span>
        )}
      </motion.div>

      <form className="mt-6">
        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex flex-wrap gap-1 lg:gap-6"
          dir="ltr"
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
              className="w-10 h-10 sm:w-[60px] sm:h-16 rounded text-center text-2xl font-medium text-default-900"
              ref={(ref) => (inputRefs.current[index] = ref)}
              disabled={!isTimerActive}
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
            disabled={!isOtpComplete || !isTimerActive}
          >
            {t("Verify Now")}
          </Button>
          <Button
            type="button"
            className="w-full my-2"
            size="lg"
            onClick={handleResendCode}
            variant={isTimerActive ? "outline" : "default"}
          >
            {isTimerActive ? t("Resend") : t("Request New Code")}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default VerifyForm;
