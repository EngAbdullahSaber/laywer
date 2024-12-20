"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../../api/chat/firebase";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslate } from "@/config/useTranslation";

interface TextProps {
  selectedChatId: string;
  setUserImage: (userId: string) => void;
}

const MessageHeader = ({ selectedChatId, setUserImage }: TextProps) => {
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [filteredUserMessages, setFilteredUserMessages] = useState<any[]>([]);
  const [UserMessages, setUserMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [active, setActive] = useState<boolean>(false); // Simulate user activity status
  const { t } = useTranslate();

  useEffect(() => {
    if (!selectedChatId) return;

    const chatGroupsQuery = query(collection(db, "chatGroups"));

    const unsubscribe = onSnapshot(
      chatGroupsQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserMessages(fetchedMessages);
        // Filter messages by selectedChatId
        const selectedChat = fetchedMessages.find(
          (message) => message.id === selectedChatId
        );
        setFilteredMessages(selectedChat ? [selectedChat] : []);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chat groups:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedChatId]);
  useEffect(() => {
    if (!selectedChatId) return;

    const [id1, id2] = selectedChatId.split("_");

    const chatUsersQuery = query(collection(db, "chatGroupUsers"));

    const unsubscribe = onSnapshot(
      chatUsersQuery,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          ...doc.data(),
        }));
        const selectedUsers = users.filter(
          (user) => user.userId == id1 || user.userId == id2
        );
        setFilteredUserMessages(selectedUsers);
      },
      (error) => {
        console.error("Error fetching chat group users:", error);
      }
    );

    return () => unsubscribe();
  }, [selectedChatId]);
  const filteredGroups = UserMessages.filter((group) =>
    filteredUserMessages[0]?.groupIds.includes(group.groupID)
  );
  if (filteredMessages[0]?.groupImage) {
    setUserImage(filteredMessages[0]?.groupImage);
  } else {
    setUserImage(filteredUserMessages[0]?.imageUrl);
  }
  return (
    <div className="flex items-center">
      {filteredMessages.length > 0 ? (
        <>
          <div className="flex flex-1 gap-3 items-center">
            <div className="relative inline-block">
              <Avatar>
                <AvatarImage
                  src={filteredMessages[0]?.groupImage || "/default-avatar.png"}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {filteredMessages[0]?.groupName?.slice(0, 2) || "??"}
                </AvatarFallback>
              </Avatar>
              <Badge
                className="h-3 w-3 p-0 ring-1 ring-border ring-offset-[1px] absolute left-[calc(100%-12px)] top-[calc(100%-12px)]"
                color={active ? "success" : "secondary"}
              ></Badge>
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium text-default-900">
                {filteredMessages[0]?.groupName || "Unknown User"}
              </div>
              <span className="text-xs text-default-500">
                {active ? t("Active Now") : t("Offline")}
              </span>
            </div>
          </div>
          <div className="flex-none space-x-2 rtl:space-x-reverse">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    className="bg-transparent hover:bg-default-50 rounded-full"
                  >
                    <span className="text-xl text-primary">
                      <Icon icon="tdesign:member-filled" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p className="my-1 font-semibold">{t("Members")}</p>
                  <hr />

                  {filteredMessages[0]?.members.map((item: any) => (
                    // <p className="my-1">{item.userName}</p>
                    <div className="flex flex-1 my-2 gap-3 items-center">
                      <div className="relative inline-block">
                        <Avatar>
                          <AvatarImage
                            src={item?.imageUrl || "/default-avatar.png"}
                            alt="User Avatar"
                          />
                          <AvatarFallback>
                            {item?.userName?.slice(0, 2) || "??"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="hidden lg:block">
                        <div className="text-sm font-medium text-default-900">
                          {item?.userName || "Unknown User"}
                        </div>
                        <span className="text-xs text-default-500">
                          {item?.isAdmin ? t("Admin") : t("User")}
                        </span>
                      </div>
                    </div>
                  ))}
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-1 gap-3 items-center">
            <div className="relative inline-block">
              <Avatar>
                <AvatarImage
                  src={
                    filteredUserMessages[0]?.imageUrl || "/default-avatar.png"
                  }
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {filteredUserMessages[0]?.userName?.slice(0, 2) || "??"}
                </AvatarFallback>
              </Avatar>
              <Badge
                className="h-3 w-3 p-0 ring-1 ring-border ring-offset-[1px] absolute left-[calc(100%-12px)] top-[calc(100%-12px)]"
                color={active ? "success" : "secondary"}
              ></Badge>
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium text-default-900">
                {filteredUserMessages[0]?.userName || "Unknown User"}
              </div>
              <span className="text-xs text-default-500">
                {active ? t("Active Now") : t("Offline")}
              </span>
            </div>
          </div>
          <div className="flex-none space-x-2 rtl:space-x-reverse">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    className="bg-transparent hover:bg-default-50 rounded-full"
                  >
                    <span className="text-xl text-primary">
                      <Icon icon="tdesign:member-filled" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <p className="my-1 font-semibold">{t("Groups")}</p>
                  <hr />

                  {filteredGroups.map((item: any) => (
                    // <p className="my-1">{item.userName}</p>
                    <div
                      className="flex flex-1 my-2 gap-3 items-center"
                      key={item.groupID}
                    >
                      <div className="relative inline-block">
                        <Avatar>
                          <AvatarImage
                            src={item?.groupImage || "/default-avatar.png"}
                            alt="User Avatar"
                          />
                          <AvatarFallback>
                            {item?.groupName?.slice(0, 2) || "??"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="hidden lg:block">
                        <div className="text-sm font-medium text-default-900">
                          {item?.groupName || "Unknown User"}
                        </div>
                        {/* <span className="text-xs text-default-500">
                          {item?.isAdmin ? "Admin" : "User"}
                        </span> */}
                      </div>
                    </div>
                  ))}
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageHeader;
