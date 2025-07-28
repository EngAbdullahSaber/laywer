"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import {
  getGridConfig,
  getXAxisConfig,
  getYAxisConfig,
} from "@/lib/appex-chart-options";
import { useTranslate } from "@/config/useTranslation";
import { useEffect, useState } from "react";

interface ReportsChartProps {
  series: ApexAxisChartSeries;
  chartColor: string;
  height?: number;
}

const ReportsChart = ({
  series,
  chartColor,
  height = 300,
}: ReportsChartProps) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const { t } = useTranslate();

  // Generate an array of dates for the current month
  const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
  };

  const [categories, setCategories] = useState<string[]>(getDaysInMonth());

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    colors: [chartColor],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird})`
    ),
    fill: {
      type: "gradient",
      colors: chartColor,
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [50, 100, 0],
      },
    },
    yaxis: {
      ...getYAxisConfig(
        `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`
      ),
      labels: {
        style: {
          colors: mode === "dark" ? "#ffffff" : "#000000", // White in dark mode, black in light
        },
      },
    },
    xaxis: {
      ...getXAxisConfig(
        `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`
      ),
      categories: categories,
      labels: {
        style: {
          colors: mode === "dark" ? "#ffffff" : "#000000", // White in dark mode, black in light
        },
        formatter: (value: string) => value,
      },
    },
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap p-4 "></div>
      <Chart
        options={options}
        series={series}
        type="area"
        height={height}
        width={"100%"}
      />
    </>
  );
};

export default ReportsChart;
