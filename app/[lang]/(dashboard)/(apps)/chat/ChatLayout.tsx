import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import MyProfileHeader from "./my-profile-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContactList from "./ContactList";
import { useQuery } from "@tanstack/react-query";
import { getContacts, getProfile } from "./chat-config";
import { useTranslate } from "@/config/useTranslation";
import UserList from "./UserList";

interface TextProps {
  setSelectedChatId: (id: string) => void;
  selectedChatId: string;
}

const ChatLayout = ({ setSelectedChatId, selectedChatId }: TextProps) => {
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("User");
  const { t } = useTranslate();

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const renderTabsTrigger = (value: string, icon: string, label: string) => (
    <TabsTrigger
      value={value}
      className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900"
    >
      <span className="text-xl mb-1">
        <Icon icon={icon} />
      </span>
      <span className="text-xs">{t(label)}</span>
    </TabsTrigger>
  );

  const renderCardContent = (children: React.ReactNode) => (
    <CardContent className="pt-0 px-0 lg:h-[calc(100%-170px)] h-[calc(100%-70px)]">
      <ScrollArea className="h-56">{children}</ScrollArea>
    </CardContent>
  );

  return (
    <div className="hidden lg:flex flex-wrap justify-between py-4 border-b border-default-200">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[400px]"
      >
        {/* Tabs List */}
        <TabsList className="grid w-full grid-cols-2 h-14">
          {renderTabsTrigger("User", "material-symbols:group", "Users")}
          {renderTabsTrigger("Chats", "gala:chat", "Chats")}
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="User">
          <Card className="h-full pb-0">
            <CardHeader className="border-none pb-0 mb-0">
              <MyProfileHeader profile={profileData} />
            </CardHeader>
            {renderCardContent(
              <ContactList
                setUserId={setUserId}
                setSelectedChatId={setSelectedChatId}
                setActiveTab={setActiveTab}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="Chats">
          <Card className="h-full pb-0">
            <CardHeader className="border-none pb-0 mb-0">
              <MyProfileHeader profile={profileData} />
            </CardHeader>
            {renderCardContent(
              <UserList
                setSelectedChatId={setSelectedChatId}
                selectedChatId={selectedChatId}
                userId={userId}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatLayout;
