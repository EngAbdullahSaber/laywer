"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../../api/chat/firebase";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextProps {
  selectedChatId: string;
  userImage: string;
}

interface Message {
  id: string;
  messageContent: string;
  isRead: boolean;
  seenBy?: string[];
  timestamp?: any; // Adjust if using a specific date type.
}

const MessageBubble = ({
  message,
  userImage,
}: {
  message: Message;
  userImage: string;
}) => (
  <div className="flex space-x-2 items-start justify-start group w-full rtl:space-x-reverse mb-4">
    {/* User Avatar */}
    <div className="flex-none self-end -translate-y-5">
      <div className="h-8 w-8 rounded-full">
        <img
          src={userImage || "/default-avatar.png"}
          alt="User Avatar"
          className="block w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
    {/* Message Content */}
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div className="whitespace-pre-wrap break-all">
          <div className="bg-primary/70 text-primary-foreground text-sm py-2 px-3 rounded-2xl flex-1">
            {message.messageContent || "No message available"}
            <div className="flex flex-row justify-end">
              <Icon
                icon={
                  message.isRead
                    ? "solar:check-read-linear"
                    : "solar:check-read-line-duotone"
                }
              />
            </div>
          </div>
        </div>
        {/* Dropdown Menu */}
        <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="w-7 h-auto rounded-full bg-default-200 flex items-center justify-center">
                <Icon icon="bi:three-dots-vertical" className="text-lg" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="!w-28 p-0"
              align="center"
              side="top"
            >
              <DropdownMenuItem className="text-xs font-semibold">
                Seen By {message?.seenBy?.length || 0} Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Timestamp */}
      <span className="text-[8px] text-end text-default-500">
        {message.timestamp?.toDate?.().toLocaleString() || "Unknown time"}
      </span>
    </div>
  </div>
);

function Messages({ selectedChatId, userImage }: TextProps) {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [backupMessages, setBackupMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMessages = (
    collectionName: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    const chatDocRef = doc(db, collectionName, selectedChatId);
    const messagesRef = collection(chatDocRef, "messages");
    const queryRef = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messages);
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching messages from ${collectionName}:`, error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeMain = fetchMessages("chatGroups", setAllMessages);
    const unsubscribeBackup = fetchMessages("ChatWithUser", setBackupMessages);

    return () => {
      unsubscribeMain();
      unsubscribeBackup();
    };
  }, [selectedChatId]);

  const messagesToDisplay =
    allMessages.length > 0 ? allMessages : [...backupMessages].reverse();

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="block md:px-6 px-0">
      {messagesToDisplay.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          userImage={userImage}
        />
      ))}
    </div>
  );
}

export default Messages;
