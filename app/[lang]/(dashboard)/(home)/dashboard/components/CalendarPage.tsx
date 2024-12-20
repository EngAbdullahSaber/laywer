"use client";

import Card from "@/components/ui/card-snippet";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { useTranslate } from "@/config/useTranslation";
const CalendarPage = () => {
  const [date, setDate] = React.useState<Date>(new Date());
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const { t } = useTranslate();

  return (
    <div className=" space-y-5">
      <Card title={t("Court Hearing Dates")}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
        />
      </Card>
    </div>
  );
};

export default CalendarPage;
