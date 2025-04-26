"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";

interface RootState {
  user: any; // Adjust this based on your actual state shape
}

interface AuthProps {
  allowedRoles: string[]; // List of allowed roles for the route
}

export const Auth = ({ allowedRoles }: AuthProps) => {
  return function AuthWrapper(WrappedComponent: any) {
    return function WrappedWithAuth(props: any) {
      const userData = useSelector((state: RootState) => state.user);
      const userRole = userData?.role_with_permission;
      const accessToken = useAccessToken();
      if (accessToken) {
        updateAxiosHeader(accessToken);
      }
      // Use useEffect to handle redirection based on role
      useEffect(() => {
        if (!userData) {
          // If user is not authenticated, redirect to login
          // redirect("/auth/login");
        } else if (!allowedRoles.includes(userRole)) {
          // If user role is not allowed, redirect to a "Not Authorized" page
          // redirect("/auth/login");
        }
      }, [userData, userRole, allowedRoles]);

      // If there is no user or the role is not allowed, render nothing or loading state
      if (!userData || !allowedRoles.includes(userRole)) {
        redirect("/auth/login"); // or <Loading /> for a better UX
      }

      // If the user is authenticated and has an allowed role, render the WrappedComponent
      return <WrappedComponent {...props} />;
    };
  };
};
// // Use useEffect inside the component body
// useEffect(() => {
//   if (!userData) {
//     // If user is not authenticated, redirect to login
//     redirect("/auth/login");
//   }
// }, [userData]);

// // If there is no user, render nothing or loading state
// if (!userData) {
//   return null; // or <Loading /> for a better UX
// }

// Once the user is available, render the WrappedComponent
