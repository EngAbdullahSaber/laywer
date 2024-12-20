"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Flatpickr from "react-flatpickr";
const CreateContact = () => {
  const gender: { value: string; label: string }[] = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const category: { value: string; label: string }[] = [
    { value: "Admin", label: "Admin" },
    { value: "S Admin", label: "S Admin" },
    { value: "Client", label: "Client" },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Contact</Button>
      </DialogTrigger>
      <DialogContent size="2xl">
        <DialogHeader className="p-0">
          <DialogTitle className="text-base font-medium text-default-700 ">
            Create a New Contact
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="h-[290px]">
            <ScrollArea className="h-full">
              <div className="sm:grid  sm:grid-cols-2 sm:gap-5 space-y-4 sm:space-y-0">
                <div className="flex flex-col gap-2">
                  <Label>User Name</Label>
                  <Input type="text" placeholder="Enter User Name" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="Enter email address" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Phone Number</Label>
                  <Input type="number" placeholder="Your phone number" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Select Category</Label>
                  <BasicSelect menu={category} />{" "}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Mobile Number</Label>
                  <Input type="number" placeholder="Enter Mobile Number" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Select Gender</Label>
                  <BasicSelect menu={gender} />{" "}
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className=" flex justify-center gap-3 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Create Contact </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContact;
