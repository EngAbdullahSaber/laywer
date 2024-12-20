import React from "react";
import ViewMore from "./View";
import DeleteButton from "./Delete";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";

import Withdraw from "../atoms/Withdraw";
import Edit from "./Edit";
interface ActionsProps {
  deleteBtn?: boolean;
  viewBtn?: boolean;
  editBtn?: boolean;
  withdrawBtn?: boolean;
  row?: any;
  title: string;
}

const Actions: React.FC<ActionsProps> = ({
  title,
  row,
  deleteBtn = true,
  viewBtn = true,
  editBtn = true,
  withdrawBtn = false,
}) => {
  return (
    <div className="flex gap-[5px]  w-full justify-center ">
      {editBtn && <Edit title={title} data={row} />}
      {viewBtn && <ViewMore title={title} data={row} />}
      {deleteBtn && <DeleteButton />}
    </div>
  );
};

export default Actions;
