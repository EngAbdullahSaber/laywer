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

// Fetch role from localStorage
const role = localStorage.getItem("role");
console.log("Role:", role);

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
       
        // {
        //   title: "Pending Cases",
        //   icon: ContactList,
        //   href: "/pendingcases",
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
  // {
  //   title: "Pending Cases",
  //   icon: Case,
  //   href: "/pending-cases",
  // },
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
          title: "Services"          ,
          icon: ContactList,
          href: "/clients-services",
        },
];

export const menusConfig = {
  mainNav: [],

  // sidebarNav: {
  //   modern: [
  //     {
  //       title: "Dashboard",
  //       icon: Dashboard,
  //       href: "/dashboard",
  //     },
     
  //     {
  //       title: "Contact List",
  //       icon: ContactList,
  //       href: "/contact-list",
  //     },
  //     {
  //       title: "lawyer Category",
  //       icon: ContactCategory,
  //       href: "/lawyer-category",
  //     },
  //     {
  //       title: "Court Category",
  //       icon: ContactCategory,
  //       href: "/court-category",
  //     }, 
  //      {
  //       title: "Cases Category",
  //       icon: ContactCategory,
  //       href: "/cases-category",
  //     },
  //     {
  //       title: "Client Category",
  //       icon: ContactCategory,
  //       href: "/client-category",
  //     },
  //     {
  //       title: "Client List",
  //       icon: ClientList,
  //       href: "/clients",
  //     },
  //     {
  //       title: "Case List",
  //       icon: Case,
  //       href: "/case",
  //     },
  //     {
  //       title: "Lawyer",
  //       icon: Lawyer,
  //       href: "/lawyer",
  //     },
  //     {
  //       title: "Tasks",
  //       icon: Tasks,
  //       href: "/tasks",
  //     },
  //     {
  //       title: "Courts",
  //       icon: Courts,
  //       href: "/courts",
  //     },
  //     {
  //       title: "Orders",
  //       icon: Courts,
  //       href: "/orders",
  //     },
  //     {
  //       title: "Lawyer Cases",
  //       icon: Case,
  //       href: "/lawyer-cases",
  //     },
  //     {
  //       title: "Lawyer Tasks",
  //       icon: Tasks,
  //       href: "/lawyer-tasks",
  //     },
  //     {
  //       title: "Lawyer Appointments",
  //       icon: Appointments,
  //       href: "/lawyer-appointments",
  //     },
  //     {
  //       title: "Clients Cases",
  //       icon: Case,
  //       href: "/client-cases",
  //     },
  //     {
  //       title: "Clients Requests",
  //       icon: Requests,
  //       href: "/client-requests",
  //     },
    
  //   ],
  //   classic: [
  //     {
  //       title: "Dashboard",
  //       icon: Dashboard,
  //       href: "/dashboard",
  //     },
     
  //     {
  //       title: "Contact List",
  //       icon: ContactList,
  //       href: "/contact-list",
  //     },
    
  //     {
  //       title: "Client List",
  //       icon: ClientList,
  //       href: "/clients",
  //     },
  //     {
  //       title: "lawyer Category",
  //       icon: ContactCategory,
  //       href: "/lawyer-category",
  //     },
  //     {
  //       title: "Court Category",
  //       icon: ContactCategory,
  //       href: "/court-category",
  //     }, 
  //      {
  //       title: "Cases Category",
  //       icon: ContactCategory,
  //       href: "/cases-category",
  //     },
  //     {
  //       title: "Client Category",
  //       icon: ContactCategory,
  //       href: "/client-category",
  //     },
  //     {
  //       title: "Case List",
  //       icon: Case,
  //       href: "/case",
  //     },
  //     {
  //       title: "Lawyer",
  //       icon: Lawyer,
  //       href: "/lawyer",
  //     },
  //     {
  //       title: "Tasks",
  //       icon: Tasks,
  //       href: "/tasks",
  //     },
  //     {
  //       title: "Courts",
  //       icon: Courts,
  //       href: "/courts",
  //     },   
  //      {
  //       title: "Orders",
  //       icon: Courts,
  //       href: "/orders",
  //     },
  //     {
  //       title: "Lawyer Cases",
  //       icon: Case,
  //       href: "/lawyer-cases",
  //     },
  //     {
  //       title: "Lawyer Tasks",
  //       icon: Tasks,
  //       href: "/lawyer-tasks",
  //     },
  //     {
  //       title: "Lawyer Appointments",
  //       icon: Appointments,
  //       href: "/lawyer-appointments",
  //     },
  //     {
  //       title: "Clients Cases",
  //       icon: Case,
  //       href: "/client-cases",
  //     },
  //        {
  //       title: "Clients Requests",
  //       icon: Requests,
  //       href: "/client-requests",
  //     },
  //   ],
  // },
  sidebarNav: {
    modern: role === "super_admin" ? adminMenu : role === "lawyer" ? lawyerMenu:clientMenu, // Admin menu for admin role, user menu otherwise
    classic: role === "super_admin" ? adminMenu : role === "lawyer" ? lawyerMenu:clientMenu, // Same logic for classic menu
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
