"use client";
import Card from "@/components/ui/card-snippet";
import { toast as reToast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { errorrehToast, successrehToast } from "./source-code";

const ToasterPage = () => {
  return (
    <div className=" space-y-5">
      <div className=" space-y-5">
        <div className=" grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <Card title=" Error Toast" code={errorrehToast}>
            <div className="flex items-center justify-center">
              <Button color="destructive" onClick={() => reToast.error("This didn't work.")}>
                Error
              </Button>
            </div>
          </Card>
          <Card title="Success Toast" code={successrehToast}>
            <div className="flex items-center justify-center">
              <Button color="success" onClick={() => reToast.success("Successfully toasted!")}>
                Success
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToasterPage;
