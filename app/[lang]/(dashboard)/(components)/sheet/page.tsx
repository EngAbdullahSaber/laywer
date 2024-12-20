"use client";

import Card from "@/components/ui/card-snippet";
import RightExtraActionSheet from "./right-extraaction-sheet";
import SubmitFormInSheet from "./submitform-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatar1 from "@/public/images/avatar/avatar-1.jpg";
import avatar2 from "@/public/images/avatar/avatar-2.jpg";

import { extraActionsSheet } from "./source-code";
const SheetPage = () => {
  return (
    <div className=" space-y-5">
      <Card title="Actions" code={extraActionsSheet}>
        <div className="flex flex-wrap gap-5">
          <RightExtraActionSheet nameBtn="To Show The Details" />
          <SubmitFormInSheet nameBtn="To Edit Form" />
        </div>
      </Card>
    </div>
  );
};

export default SheetPage;
