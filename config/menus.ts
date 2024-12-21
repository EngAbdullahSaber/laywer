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
} from "@/components/svg";

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

export const menusConfig = {
  mainNav: [],

  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: Dashboard,
        href: "/dashboard",
      },
     
      // {
      //   title: "Contact List",
      //   icon: ContactList,
      //   href: "/contact-list",
      // },
      // {
      //   title: "Contact Category",
      //   icon: ContactCategory,
      //   href: "/contact-category",
      // },
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
        title: "Lawyer",
        icon: Lawyer,
        href: "/lawyer ",
      },
      {
        title: "Tasks",
        icon: Tasks,
        href: "/task ",
      },
      {
        title: "Courts",
        icon: Courts,
        href: "/courts ",
      },
      {
        title: "Lawyer Cases",
        icon: Case,
        href: "/lawyer-cases",
      },
      {
        title: "Lawyer Tasks",
        icon: Tasks,
        href: "/lawyer-tasks ",
      },
      {
        title: "Lawyer Appointments",
        icon: Appointments,
        href: "/lawyer-appointments ",
      },
      {
        title: "Clients Cases",
        icon: Case,
        href: "/client-cases",
      },
      {
        title: "Clients Requests",
        icon: Requests,
        href: "/client-requests",
      },
    
    ],
    classic: [
      {
        title: "Dashboard",
        icon: Dashboard,
        href: "/dashboard",
      },
     
      // {
      //   title: "Contact List",
      //   icon: ContactList,
      //   href: "/contact-list",
      // },
      // {
      //   title: "Contact Category",
      //   icon: ContactCategory,
      //   href: "/contact-category",
      // },
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
        title: "Lawyer",
        icon: Lawyer,
        href: "/lawyer ",
      },
      {
        title: "Tasks",
        icon: Tasks,
        href: "/task ",
      },
      {
        title: "Courts",
        icon: Courts,
        href: "/courts ",
      },
      {
        title: "Lawyer Cases",
        icon: Case,
        href: "/lawyer-cases",
      },
      {
        title: "Lawyer Tasks",
        icon: Tasks,
        href: "/lawyer-tasks ",
      },
      {
        title: "Lawyer Appointments",
        icon: Appointments,
        href: "/lawyer-appointments ",
      },
      {
        title: "Clients Cases",
        icon: Case,
        href: "/client-cases",
      },
         {
        title: "Clients Requests",
        icon: Requests,
        href: "/client-requests",
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
