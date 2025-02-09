"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../../api/chat/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "./loader";

interface ContactListProps {
  setUserId: (id: string) => void;
  setActiveTab: (id: string) => void;
  setSelectedChatId: (id: any | null) => void;
}

const ContactList = ({
  setUserId,
  setSelectedChatId,
  setActiveTab,
}: ContactListProps) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = () => {
      const contactQuery = query(collection(db, "chatGroupUsers"));
      const unsubscribe = onSnapshot(
        contactQuery,
        (snapshot) => {
          const fetchedContacts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setContacts(fetchedContacts);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching contacts:", error);
          setLoading(false);
        }
      );
      return unsubscribe;
    };

    const unsubscribe = fetchContacts();
    return () => unsubscribe();
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setUserId(userId);
    setActiveTab("Chats");
    setSelectedChatId(null);
  };

  if (loading) return <Loader />;

  if (contacts.length === 0) {
    return <p className="text-center text-gray-500">No contacts found.</p>;
  }

  return (
    <div>
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          isSelected={selectedUserId === contact.userId}
          onSelect={() => handleUserSelect(contact.userId)}
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  contact: any;
  isSelected: boolean;
  onSelect: () => void;
}

const ContactItem = ({ contact, isSelected, onSelect }: ContactItemProps) => {
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
            src={contact.imageUrl || "/default-avatar.png"}
            alt={`${contact.userName || "Unknown"} Image`}
          />
          <AvatarFallback className="uppercase">
            {contact.userName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="block">
          <div className="truncate max-w-[120px]">
            <span className="text-sm text-default-900 font-medium">
              {contact.userName || "Unknown User"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-none flex-col items-end gap-2 hidden lg:flex">
        {/* Placeholder for additional details like timestamps or unread messages */}
      </div>
    </div>
  );
};

export default ContactList;
