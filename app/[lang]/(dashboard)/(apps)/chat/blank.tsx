"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";
const Blank = ({ mblChatHandler }: { mblChatHandler: () => void }) => {
  const { t } = useTranslate();

  const isLg = useMediaQuery("(max-width: 1024px)");
  return (
    <Card className="flex-1">
      <CardContent className="h-full flex justify-center items-center">
        <div className="text-center flex flex-col items-center">
          <Icon icon="uiw:message" className="text-7xl text-default-300" />
          <div className="mt-4 text-lg font-medium text-default-500">
            {t("No message yet")}
          </div>
          <p className="mt-1 text-sm font-medium text-default-400">
            {t("don't worry, just take a deep breath & say 'Hello'")}
          </p>
          {isLg && (
            <Button onClick={mblChatHandler} className="mt-2">
              Start Conversation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Blank;
