"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import UsersDataChart from "./users-data-chart";
import UsersDataTable from "./users-data-table";
import { useTranslate } from "@/config/useTranslation";
interface Users {
  id: number;
  country: string;
  count: string;
}

const UsersStat = () => {
  const {t} = useTranslate()

  const usersData:Users[] = [
    {
      id: 1,
      country: t("Bangladesh"),
      count: "05",
    },
    {
      id: 2,
      country: t("India"),
      count: "06",
    },
    {
      id: 3,
      country: t("Pakistan"),
      count: "06",
    },
    {
      id: 4,
      country: t("Australia"),
      count: "10",
    },
    {
      id: 5,
      country: t("America"),
      count: "08",
    },
  ];
  return (
    <Card>
      <CardHeader className="border-none pb-0 mb-5">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <div className="text-xl font-semibold text-default-900">  {t("Users")}  </div>
            <span className="text-xs text-default-600 ml-1"> {t("In Last 30 Minutes")} </span>
          </div>
          <div className="flex-none flex items-center gap-1">
            <span className="text-4xl font-semibold text-primary"> {t("63")} </span>
            <span className="text-2xl text-success">
              <Icon icon="heroicons:arrow-trending-up-16-solid" />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-0">
        <p className="text-xs font-medium text-default-800"> {t("User Per Minutes")} </p>
        <UsersDataChart />
        <UsersDataTable
          users={usersData}
        />
      </CardContent>
    </Card>
  );
};

export default UsersStat;