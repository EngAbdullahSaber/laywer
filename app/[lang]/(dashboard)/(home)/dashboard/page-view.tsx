"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { useTranslate } from "@/config/useTranslation";
import { Docs } from "@/components/svg";
import cardBg from "../../../../assets/service_card_bg.png";
import "./custemStyleReports.css";
import Image from "next/image";
import CalendarPage from "./components/CalendarPage";
import ReportsChart from "./components/reports-snapshot/reports-chart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashBoardInfo } from "@/services/auth/auth";
import { useParams } from "next/navigation";
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import { useAllowedRoles } from "@/config/useAllowedRoles";

interface ReportItem {
  id: number;
  name: string;
  count: string;
  rate: string;
  href: string;
  icon: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "destructive"
    | "default"
    | "dark";
}

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  const [data, setData] = useState<any>([]);
  const { lang } = useParams();
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;

  const accessToken = useAccessToken();
  if (accessToken) {
    updateAxiosHeader(accessToken);
  }

  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const [calenderDate, setCalenderDate] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const { allowedRoles, error } = useAllowedRoles();

  const getMessagesData = async () => {
    setLoading(true);
    const formData = new FormData();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const currentDate = `${year}-${month}`;
    const currentDate1 = `${year}-${month}-${day}`;
    formData.append("suit_month", currentDate);
    formData.append("next_appointments_date", currentDate1);

    try {
      const res = await getDashBoardInfo(lang, formData);
      setData(res?.body || []);
      setCalenderDate(
        res?.body?.next_appointments_date?.map((item) => ({
          title: item.title,
          appointment_time: item.appointment_time,
          name: item.lawyer?.name,
          date: new Date(item.appointment_date).toISOString().split("T")[0],
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessagesData();
  }, []);

  const transformChartData = (suitsThisMonth: any[]) => {
    if (!suitsThisMonth || suitsThisMonth.length === 0) return [];

    const casesByDay: Record<string, number> = {};
    suitsThisMonth.forEach((suit) => {
      const date = new Date(suit.created_at).toISOString().split("T")[0];
      casesByDay[date] = (casesByDay[date] || 0) + 1;
    });
    return Object.entries(casesByDay).map(([date, count]) => ({
      x: date,
      y: count,
    }));
  };

  const reports: ReportItem[] = [
    {
      id: 1,
      name: "Total Clients",
      count: data.all_clients || "0",
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      color: "primary",
      href: "clients",
    },
    {
      id: 2,
      name: "Total Laywer",
      count: data.all_lawyers || "0",
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      color: "warning",
      href: "lawyer",
    },
    {
      id: 3,
      name: "Total Case",
      count: data.suits || "0",
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      href: "case",
      color: "destructive",
    },
    {
      id: 4,
      name: "Total Task",
      count: data.tasks || "0",
      href: "task",
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      color: "destructive",
    },
  ];

  const primary = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
  })`;

  if (!allowedRoles) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">
          {t("Analytics Dashboard")}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center">
        {reports.map((item) => (
          <Card
            key={item.id}
            className={`service-card hover:bg-lawyer before:absolute before:h-[110px] before:w-[110px] before:opacity-60 before:rounded-full before:z-[-1] before:bottom-[-73px] before:right-[-28px] lg:w-[24%] md:w-[45%] w-full p-6 relative z-10 rounded-xl overflow-hidden bg-white dark:bg-slate-800 dark:text-white`}
          >
            <a href={item.href}>
              <div className="shape-icon before:absolute before:inset-0 before:bg-[#e2e8fa] relative z-10 flex justify-center items-center w-[90px] h-[85px] leading-10 align-middle mb-7">
                <span
                  className={`dots before:absolute before:h-[22px] before:w-[22px] before:top-0 before:right-[9px] before:rounded-full after:absolute after:h-[22px] after:w-[22px] after:bottom-[-10px] after:left-[21px] after:rounded-full`}
                >
                  {item.icon}
                </span>
              </div>
              <h3 className="box-title font-bold text-xl mt-[-0.32em] leading-[1.4]">
                {t(item.name)}
              </h3>
              <div
                className={`text-lg box-title font-semibold text-${item.color} mt-1`}
              >
                {item.count}
              </div>
              <div className="bg-shape">
                <Image
                  src={cardBg}
                  alt="bg"
                  className="w-full"
                  layout="responsive"
                  quality={100}
                />
              </div>
            </a>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Number of Cases This Month")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsChart
            series={[
              {
                name: "Cases",
                data: transformChartData(data.suits_this_month || []),
              },
            ]}
            chartColor={primary}
          />
        </CardContent>
      </Card>

      <CalendarPage calenderDate={calenderDate} />
    </div>
  );

  const ProtectedPage = Auth({ allowedRoles })(DashboardView);
  return <ProtectedPage />;
};

export default PageWithAuth;
