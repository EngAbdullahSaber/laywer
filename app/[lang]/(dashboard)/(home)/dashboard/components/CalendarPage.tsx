"use client";

import Card from "@/components/ui/card-snippet";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { useTranslate } from "@/config/useTranslation";

const CalendarPage = ({ calenderDate }: { calenderDate: any }) => {
  // Initialize the state with actual Date objects
  const [dates, setDates] = React.useState<Date[]>([
    new Date("2024-12-13"),
    new Date("2024-12-19"),
    new Date("2024-12-25"),
    new Date("2024-12-29"),
    new Date("2024-12-27"),
  ]);

  // Handle selecting and deselecting dates
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Check if the date is already selected
      const isSelected = dates.some(
        (date) => date.toDateString() === selectedDate.toDateString()
      );

      // If the date is already selected, remove it from the array
      if (isSelected) {
        setDates((prevDates) =>
          prevDates.filter(
            (date) => date.toDateString() !== selectedDate.toDateString()
          )
        );
      } else {
        // If it's not selected, add it to the array
        setDates((prevDates) => [...prevDates, selectedDate]);
      }
    }
  };

  const { t } = useTranslate();

  return (
    <div className="space-y-5">
      <Card title={t("Upcoming Session Dates")}>
        <Calendar
          mode="multiple" // Use 'multiple' mode to select multiple dates
          selected={calenderDate}
          className="rounded-md border"
        />
      </Card>
    </div>
  );
};

export default CalendarPage;
