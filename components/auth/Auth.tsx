"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

interface RootState {
  user: any; // Adjust this based on your actual state shape
}

export const Auth = (WrappedComponent: any) => {
  return function AuthWrapper(props: any) {
    // const userData = useSelector((state: RootState) => state.user);
    // console.log(userData?.user?.role_with_permission?.name);

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
    return <WrappedComponent {...props} />;
  };
};
