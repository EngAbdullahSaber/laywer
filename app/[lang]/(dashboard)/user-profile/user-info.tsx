"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  Location,
  Calender,
  password,
  email,
  CalenderCheck,
} from "@/components/svg";

import { useTranslate } from "@/config/useTranslation";
import ImageUploader from "./ImageUploader";
interface UserInfoItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const UserInfo = () => {
  const userInfo: UserInfoItem[] = [
    {
      icon: User,
      label: "Full Name",
      value: "Jennyfer Frankin",
    },
    {
      icon: Phone,
      label: "Mobile",
      value: "+(1) 987 6543",
    },
    {
      icon: Location,
      label: "Address",
      value: "101, California",
    },
    {
      icon: CalenderCheck,
      label: "Joining Date",
      value: "24 Nov 2021",
    },
    {
      icon: password,
      label: "Password",
      value: "kfjfsdp324",
    },
    {
      icon: email,
      label: "Email",
      value: "aa@aa.com",
    },
  ];
  const data = [
    { id: "ID photo", img: "https://picsum.photos/200/300?random=21" },
    { id: "Membership photo", img: "https://picsum.photos/200/300?random=11" },
    {
      id: "licence photo",
      img: "https://picsum.photos/200/300?random=21",
    },
    { id: "Licensing photo", img: "https://picsum.photos/200/300?random=11" },
  ];
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const { t, loading, error } = useTranslate();
  const handleOpenUpdatPhoto = () => {
    setOpen(!open);
  };
  const handleOpenUpdatInfo = () => {
    setOpenInfo(!open);
  };
  return (
    <Card>
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-xl font-bold text-default-800">
          {t("Lawyer Information")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-8">
        <div className="flex flex-row justify-end"> </div>
        <ul className="mt-6 space-y-4">
          {userInfo.map((item, index) => (
            <li
              key={`user-info-${index}`}
              className="flex flex-row gap-6 items-center"
            >
              <div className="flex-none w-[30%] 2xl:w-56 flex items-center gap-1.5">
                <span>{<item.icon className="w-10 h-10 text-primary" />}</span>
                <span className="text-lg font-medium text-default-800">
                  {t(item.label)}:
                </span>
              </div>
              <div className="flex-1 text-lg font-medium w-[60%] text-default-700">
                {item.value}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-row flex-wrap justify-start gap-5 pb-20 items-center p-5">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col relative h-40 w-[23%] justify-around  items-start rounded-md shadow-md bg-white"
            >
              <div
                className="bg-slate-300 cursor-pointer rounded-full p-1 absolute top-16  right-2"
                onClick={handleOpenUpdatPhoto}
              >
                {" "}
                <Icon
                  icon="ic:twotone-edit"
                  width="20"
                  height="20"
                  className="  text-red-500 "
                />{" "}
              </div>
              <Label className="my-4 text-center font-semibold text-lg">
                {t(item.id)}
              </Label>
              <img
                src={item.img}
                alt="image"
                className="w-full h-full rounded-md"
              />
            </div>
          ))}{" "}
        </div>
        <Dialog open={open} onOpenChange={handleOpenUpdatPhoto}>
          <DialogContent className="p-6 !h-auto" size="md">
            <div className="flex flex-row justify-between mt-5 w-full gap-[10px]  mx-auto  items-center">
              <div className="flex flex-col gap-2  w-full">
                <ImageUploader />
              </div>
            </div>
            <DialogFooter className="">
              <DialogClose asChild>
                <Button type="submit" variant="outline">
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button type="submit" color="warning">
                {t("Save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
