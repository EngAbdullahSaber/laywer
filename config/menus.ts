import {
  ContactList,
  ContactCategory,
  ClientList,
  Case,
  Lawyer,
  Requests,
  Appointments,
  Tasks,
  Courts,
  Dashboard,
  Features,
  Regions,
  Reports,
  Property,
  Finance,
  products,
  reports,
  Reservation,
} from "@/components/svg";
import { useRole } from "./useRole"; // Import the custom hook
export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
}

// Define menu configurations for admin and user roles
const adminMenu = [
  {
    title: "Dashboard",
    icon: Dashboard,
    href: "/dashboard",
  },
  {
    title: "New Orders",
    icon: ContactList,
    href: "/neworder",
  },

  {
    title: "Client List",
    icon: ClientList,
    href: "/clients",
  },
  {
    title: "Case List",
    icon: Case,
    href: "/case",
  },
  {
    title: "Lawyers",
    icon: Lawyer,
    href: "/lawyer",
  },
  {
    title: "Tasks",
    icon: Tasks,
    href: "/tasks",
  },
  {
    title: "Courts",
    icon: Courts,
    href: "/courts",
  },
  {
    title: "Orders",
    icon: Reservation,
    href: "/orders",
  },
  {
    title: "Services Orders",
    icon: reports,
    href: "/orders-services",
  },
  {
    title: "Contact List",
    icon: ContactList,
    href: "/contact-list",
  },
  {
    title: "Staff",
    icon: products,
    href: "/staff",
  },
  {
    title: "Services",
    icon: Finance,
    href: "/services",
  },
  {
    title: "lawyers Categories",
    icon: ContactCategory,
    href: "/lawyer-category",
  },
  {
    title: "Courts Categories",
    icon: Features,
    href: "/court-category",
  },
  {
    title: "Cases Categories",
    icon: Regions,
    href: "/cases-category",
  },
  {
    title: "Clients Categories",
    icon: Reports,
    href: "/client-category",
  },
  {
    title: "Contact List Categories",
    icon: Reports,
    href: "/contactList-category",
  },
  {
    title: "Staff Categories",
    icon: Property,
    href: "/staff-category",
  },
];
const lawyerMenu = [
  {
    title: "Cases",
    icon: Case,
    href: "/lawyer-cases",
  },
  {
    title: "Tasks",
    icon: Tasks,
    href: "/lawyer-tasks",
  },
  {
    title: "Appointments",
    icon: Appointments,
    href: "/lawyer-appointments",
  },
];
const clientMenu = [
  {
    title: "Cases",
    icon: Case,
    href: "/client-cases",
  },
  {
    title: "Requests",
    icon: Requests,
    href: "/client-requests",
  },
  {
    title: "Communication",
    icon: ContactList,
    href: "/new-order",
  },
  {
    title: "Services",
    icon: ContactList,
    href: "/clients-services",
  },
];

export const getMenusConfig = (role) => ({
  mainNav: [],
  sidebarNav: {
    modern:
      role == "super_admin"
        ? adminMenu
        : role == "lawyer"
        ? lawyerMenu
        : clientMenu,
    classic:
      role == "super_admin"
        ? adminMenu
        : role == "lawyer"
        ? lawyerMenu
        : clientMenu,
  },
});

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
