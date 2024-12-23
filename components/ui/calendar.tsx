import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null); // Track hovered date
  const [clickedDate, setClickedDate] = React.useState<Date | null>(null); // Track clicked date
  const [showPopup, setShowPopup] = React.useState(false); // State to control pop-up visibility

  // Handle hover event
  const handleHover = (date: Date) => {
    setHoveredDate(date);
    showPopupFor30Seconds(); // Show pop-up for 30 seconds on hover
  };

  // Handle click event
  const handleClick = (date: Date) => {
    setClickedDate(date);
    showPopupFor30Seconds(); // Show pop-up for 30 seconds on click
  };

  // Function to handle conditional message based on date
  const getPopupMessage = (date: Date | null) => {
    if (!date) return "";

    const dateString = date.toDateString();

    // Check if date contains the number "1" to determine appointment type
    if (dateString.includes("1")) {
      return "Appointment in court";
    }
    return "Appointment with client";
  };

  // Function to show pop-up for 30 seconds
  const showPopupFor30Seconds = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false); // Hide pop-up after 30 seconds
      setClickedDate(null);
    }, 1000); // 30 seconds
  };

  return (
    <div className="relative">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-0 md:p-3", className)}
        classNames={{
          months: "w-full  space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "flex-1 text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full gap-1 mt-2",
          cell: "flex-1 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary [&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20",
          day: "w-full h-10 rounded  p-0 font-normal aria-selected:opacity-100 bg-transparent text-current hover:text-primary",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        onDayHover={handleHover} // Set hover handler
        onDayClick={handleClick} // Set click handler
        {...props}
      />

      {/* Render pop-up when a day is hovered or clicked */}
      {showPopup && (hoveredDate || clickedDate) && (
        <div
          className="absolute bg-gray-900 text-white p-3 rounded-md"
          style={{
            top: "50px", // Adjust this based on your design
            left: "50%",
            background: "#000080", // You can change the background color
            transform: "translateX(-50%)",
            zIndex: 9999,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>
            {`Details for: ${
              clickedDate
                ? `${clickedDate.toDateString()} - ${getPopupMessage(
                    clickedDate
                  )}`
                : hoveredDate
                ? `${hoveredDate.toDateString()} - ${getPopupMessage(
                    hoveredDate
                  )}`
                : ""
            }`}
          </p>
        </div>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
