import React from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";

const Withdraw = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="secondary"
          >
            <Icon icon="vaadin:money-withdraw" className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent size="md" className="min-h-72">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-default-700 ">
              Send Money
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-default-500  space-y-4">
            <div className="flex flex-col gap-2">
              <Label>IBAN</Label>
              <Input type="text" placeholder="Type Here ...." />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bank Name</Label>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Amount</Label>
              <Input type="text" placeholder="Type Here ...." />
            </div>
          </div>

          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button type="submit" variant="outline">
                Send Money
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;
