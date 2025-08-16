import React from "react";

import { Badge } from "@/components/ui/badge";
import { cn, isLocationMatch, translate, getDynamicPath } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslate } from "@/config/useTranslation";

const SingleMenuItem = ({
  item,
  collapsed,
  hovered,
  trans,
  onItemClick,
}: {
  item: any;
  collapsed: boolean;
  hovered: boolean;
  trans: any;
  onItemClick?: () => void; // Add this type
}) => {
  const { badge, href, title } = item;
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const handleClick = (e: React.MouseEvent) => {
    if (onItemClick) {
      onItemClick();
    }
    // You might want to prevent default if needed
    // e.preventDefault();
  };
  const { Navigate, t } = useTranslate();
  return (
    <a href={Navigate(href)}>
      <>
        {!collapsed || hovered ? (
          <div
            className={cn(
              "flex  gap-3 group  text-default-700 dark:text-default-950    dark:hover:bg-[#dfc77d] dark:hover:text-[#000] font-medium  text-sm capitalize px-[10px] py-3 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground",
              {
                "dark:bg-[#dfc77d] bg-primary dark:text-[#000] text-[#fff] ":
                  isLocationMatch(href, locationName),
              }
            )}
          >
            <span className="flex-grow-0">
              <item.icon className="w-5 h-5  " />
            </span>
            <div className="text-box flex-grow">{t(title)}</div>
            {badge && <Badge className=" rounded">{item.badge}</Badge>}
          </div>
        ) : (
          <div>
            <span
              className={cn(
                "h-12 w-12 mx-auto rounded-md dark:hover:bg-[#dfc77d] dark:hover:text-[#000] transition-all duration-300 inline-flex flex-col items-center justify-center  relative  ",
                {
                  "dark:bg-[#dfc77d] dark:text-[#000] ": isLocationMatch(
                    href,
                    locationName
                  ),
                  " text-default-600   ": !isLocationMatch(href, locationName),
                }
              )}
            >
              <item.icon className="w-6 h-6" />
            </span>
          </div>
        )}
      </>
    </a>
  );
};

export default SingleMenuItem;
