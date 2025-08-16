"use client";
import React, { useState } from "react";
import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import { useSidebar, useThemeStore } from "@/store";
import SidebarLogo from "../common/logo";
import { useRole } from "@/config/useRole";
import { getMenusConfig } from "@/config/menus";
import MenuLabel from "../common/menu-label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, usePathname } from "next/navigation";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSelector } from "react-redux";

const ClassicSidebar = ({ trans }: { trans: string }) => {
  const { sidebarBg } = useSidebar();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);

  const role = useRole(); // Fetch role using the custom hook
  const menusConfig = getMenusConfig(role); // Generate menusConfig based on the role
  const { collapsed, setCollapsed } = useSidebar();
  const menus = menusConfig?.sidebarNav?.classic || [];
  const { isRtl } = useThemeStore();
  const [hovered, setHovered] = useState<boolean>(false);
  const { lang } = useParams();

  const handleItemClick = () => {
    if (collapsed === false) {
      setCollapsed(true);
    }
  };

  const toggleSubmenu = (i: number) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex: number) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  React.useEffect(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;
    menus?.map((item: any, i: number) => {
      if (item?.child) {
        item.child.map((childItem: any, j: number) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
          }
          if (childItem?.multi_menu) {
            childItem.multi_menu.map((multiItem: any, k: number) => {
              if (isLocationMatch(multiItem.href, locationName)) {
                subMenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });
    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
  }, [locationName]);

  // Only check permissions if role is neither lawyer nor client
  const shouldCheckPermissions =
    role !== "lawyer" && role !== "client" && role !== undefined;

  const permissionString =
    shouldCheckPermissions && typeof window !== "undefined"
      ? localStorage.getItem("permissions")
      : null;
  const permissions = permissionString ? JSON.parse(permissionString) : [];

  const titleToApiMap: Record<string, string> = {
    Dashboard: "api.home",
    "Roles and Permission": "api.roles",
    "New Orders": "api.orders",
    "Client List": "api.clients",
    "Case List": "api.cases",
    "Archived Case": "api.cases",
    Lawyers: "api.lawyers",
    Tasks: "api.tasks",
    Courts: "api.courts",
    Orders: "api.orders",
    "Services Orders": "api.service::orders",
    "Contact List": "api.contact::list",
    Staff: "api.staffs",
    Transaction: "api.transactions",
    Services: "api.services",
    "lawyers Categories": "api.lawyers::categories",
    "Courts Categories": "api.courts::categories",
    "Cases Categories": "api.cases::categories",
    "Clients Categories": "api.clients::categories",
    "Contact List Categories": "api.cases",
    "Lawyer Appointmentss": "api.lawyer.appointmentss",
    "Lawyer Orderss": "api.lawyer.orderss",
    "Lawyer Casess": "api.lawyer.casess",
    "Lawyer Taskss": "api.lawyer.tasks",
    "Client Casess": "api.client.casess",
    "Client Requestss": "api.client.requestss",
    "Client Communicationss": "api.client.communicationss",
    "Client Servicess": "api.client.servicess",
  };

  // Function to check if a page has "عرض الكل" permission
  const hasViewAllPermission = (apiKey: string): boolean => {
    if (!shouldCheckPermissions) return true; // Skip check if not needed

    const permissionGroup = permissions.find(
      (p: any) => p.parent_key_name === apiKey
    );
    if (!permissionGroup) return false;

    return permissionGroup.permissions.some(
      (p: any) => p.name === "عرض الكل" || p.name === "View all"
    );
  };

  // Filter the titleToApiMap to only include pages with view all permission
  const filteredPages = Object.entries(titleToApiMap).reduce(
    (acc, [title, apiKey]) => {
      if (hasViewAllPermission(apiKey)) {
        acc[title] = apiKey;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  // Use filteredPages instead of titleToApiMap for your navigation/display logic
  const allowedKeys = shouldCheckPermissions
    ? new Set(Object.values(filteredPages))
    : new Set(Object.values(titleToApiMap)); // Allow all if not checking permissions
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed z-[999] top-0 bg-card h-full hover:!w-[248px] border-r",
        {
          "w-[248px]": !collapsed,
          "w-[72px]": collapsed,
          "shadow-md": collapsed || hovered,
        }
      )}
    >
      {sidebarBg !== "none" && (
        <div
          className="absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${sidebarBg})` }}
        ></div>
      )}

      <SidebarLogo hovered={hovered} />

      <ScrollArea
        className={cn("sidebar-menu h-[calc(100%-80px)]", {
          "px-4": !collapsed || hovered,
        })}
      >
        <ul
          dir={lang == "ar" ? "rtl" : "ltr"}
          className={cn("space-y-1", {
            "space-y-2 text-center": collapsed,
            "text-start": collapsed && hovered,
          })}
        >
          {menus.map((item, i) => (
            <li key={`menu_key_${i}`}>
              {/* single menu */}
              {!item.child &&
                !item.isHeader &&
                titleToApiMap[item.title] &&
                allowedKeys.has(titleToApiMap[item.title]) && (
                  <SingleMenuItem
                    item={item}
                    collapsed={collapsed}
                    hovered={hovered}
                    trans={trans}
                    onItemClick={handleItemClick}
                  />
                )}

              {/* menu label */}
              {item.isHeader && !item.child && (!collapsed || hovered) && (
                <MenuLabel item={item} trans={trans} />
              )}

              {/* sub menu */}
              {item.child && (
                <>
                  <SubMenuHandler
                    item={item}
                    toggleSubmenu={toggleSubmenu}
                    index={i}
                    activeSubmenu={activeSubmenu}
                    collapsed={collapsed}
                    hovered={hovered}
                    trans={trans}
                  />

                  {(!collapsed || hovered) && (
                    <NestedSubMenu
                      toggleMultiMenu={toggleMultiMenu}
                      activeMultiMenu={activeMultiMenu}
                      activeSubmenu={activeSubmenu}
                      item={item}
                      index={i}
                      trans={trans}
                    />
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default ClassicSidebar;
