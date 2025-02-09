"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../../api/chat/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "./loader";
import { useTranslate } from "@/config/useTranslation";

interface UserListProps {
  setSelectedChatId: (id: string) => void;
  selectedChatId: string;
  userId: string;
}

const UserList = ({
  setSelectedChatId,
  selectedChatId,
  userId,
}: UserListProps) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslate();

  useEffect(() => {
    if (!userId) {
      console.error("No user ID provided");
      setLoading(false);
      return;
    }

    const userChatsRef = collection(doc(db, "users", userId), "userChats");
    const chatsQuery = query(userChatsRef);

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatList(chats);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user chats:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);
  useEffect(() => {
    if (!selectedChatId) {
      setSelectedChatId(chatList[0]?.id);
    }
  }, [chatList]);
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  if (loading) return <Loader />;

  if (!userId) {
    return (
      <p className="text-center text-gray-500">
        {t("No chats available Please Select User First")}
      </p>
    );
  }
  console.log(chatList[0].id);
  if (!chatList.length) {
    return (
      <p className="text-center text-gray-500">{t("No chats available")}</p>
    );
  }
  return (
    <div>
      {chatList.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChatId === chat.id}
          onSelect={() => handleChatSelect(chat.id)}
        />
      ))}
    </div>
  );
};

interface ChatItemProps {
  chat: any;
  isSelected: boolean;
  onSelect: () => void;
}

const ChatItem = ({ chat, isSelected, onSelect }: ChatItemProps) => {
  const isGroup = chat.isGroup;

  return (
    <div
      className={`flex gap-4 py-2 lg:py-2.5 px-3 border-l-2 border-transparent cursor-pointer hover:bg-default-200 ${
        isSelected ? "bg-default-200" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex-1 flex gap-3">
        <Avatar>
          <AvatarImage
            src={chat?.imageUrl || "/default-avatar.png"}
            alt={`${chat.userName || "User"} Image`}
          />
          <AvatarFallback className="uppercase">
            {chat.userName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="block  ">
          <span className="text-sm text-default-900 font-medium">
            {chat.userName || "Unknown User"}
          </span>
          {isGroup && (
            <span className="text-xs text-default-500"> (Group)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
