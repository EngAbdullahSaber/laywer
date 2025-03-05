"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "./components/reports-snapshot";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import DatePickerWithRange from "@/components/date-picker-with-range";
import { useTranslate } from "@/config/useTranslation";
import PopupMarkerMap from "../../(map)/map-react-leaflet/popup-marker-map";
import { Docs } from "@/components/svg";
import cardBg from "../../../../assets/service_card_bg.png";
import { TrendingUp } from "lucide-react";
import "./custemStyleReports.css";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import CalendarPage from "./components/CalendarPage";
import ReportsChart from "./components/reports-snapshot/reports-chart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashBoardInfo } from "@/services/auth/auth";
import { useParams } from "next/navigation";
import { Auth } from "@/components/auth/Auth";

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

const DashboardPageView = () => {
  const { t } = useTranslate();
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();

  const getMessagesData = async () => {
    setLoading(true);
    const formData = new FormData();
    const now = new Date(); // Get the current date
    const year = now.getFullYear(); // Get the full year (e.g., 2025)
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Get the month (0-11, so add 1) and pad with leading zero if necessary

    const currentDate = `${year}-${month}`; // Format as "YYYY-MM"
    formData.append("suit_month", currentDate);
    formData.append("next_appointments_date", "2025-03-21");

    try {
      const res = await getDashBoardInfo(lang, formData);
      console.log(res?.body);
      setData(res?.body || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessagesData();
  }, []);

  // Transform `suits_this_month` data for the chart
  const transformChartData = (suitsThisMonth: any[]) => {
    if (!suitsThisMonth || suitsThisMonth.length === 0) return [];

    // Group cases by day
    const casesByDay: Record<string, number> = {};

    suitsThisMonth.forEach((suit) => {
      const date = new Date(suit.created_at).toISOString().split("T")[0]; // Extract YYYY-MM-DD
      if (casesByDay[date]) {
        casesByDay[date]++;
      } else {
        casesByDay[date] = 1;
      }
    });
    console.log(casesByDay);
    // Convert to ApexCharts format
    return Object.entries(casesByDay).map(([date, count]) => ({
      x: date,
      y: count,
    }));
  };

  const reports: ReportItem[] = [
    {
      id: 1,
      name: "Total Clients",
      count: data.all_clients || 0,
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      color: "primary",
      href: "clients",
    },
    {
      id: 2,
      name: "Total Laywer",
      count: data.all_lawyers || 0,
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      color: "warning",
      href: "lawyer",
    },
    {
      id: 3,
      name: "Total Case",
      count: data.suits || 0,
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      href: "case",
      color: "destructive",
    },
    {
      id: 4,
      name: "Total Task",
      count: data.tasks || 0,
      href: "task",
      rate: "8.2",
      icon: <Docs className="w-10 h-10 text-primary" />,
      color: "destructive",
    },
  ];

  const primary = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
  })`;

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800 ">
          {" "}
          {t("Analytics Dashboard")}{" "}
        </div>
      </div>

      {/* reports area */}
      <div className="flex flex-row justify-between items-center   ">
        {reports.map((item) => (
          <Card
            key={item.id}
            className={`service-card hover:bg-lawyer before:absolute before:h-[110px] before:w-[110px]   before:opacity-60 before:rounded-full before:z-[-1] before:bottom-[-73px] before:right-[-28px] lg:w-[24%] md:w-[45%] w-full p-6 relative z-10 rounded-xl overflow-hidden bg-white dark:bg-slate-800 dark:text-white`}
          >
            <Link href={item.href}>
              <div className="shape-icon  before:absolute before:inset-0 before:bg-[#e2e8fa] relative z-10 flex justify-center items-center w-[90px] h-[85px] leading-10 align-middle mb-7">
                <span
                  className={`dots before:absolute  before:h-[22px] before:w-[22px]  before:top-0 before:right-[9px] before:rounded-full 
           after:absolute   after:h-[22px] after:w-[22px]    after:bottom-[-10px] after:left-[21px] after:rounded-full `}
                >
                  {item.icon}
                </span>
              </div>
              <h3 className="box-title font-bold text-xl mt-[-0.32em] leading-[1.4]">
                {t(item.name)}{" "}
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
                  layout="responsive" // You can change this to fit your needs
                  quality={100} // Optional, you can set the quality if needed
                />{" "}
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
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

      <CalendarPage />
    </div>
  );
};

const allowedRoles = ["super_admin"];

const ProtectedComponent = Auth({ allowedRoles })(DashboardPageView);

export default ProtectedComponent;
