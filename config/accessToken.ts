"use client";

import { useSelector } from "react-redux";
interface RootState {
  user: any; // Adjust this based on your actual state shape
}
export const useAccessToken = () => {
  const accessToken = useSelector((state: RootState) => state.user);
  return accessToken;
};
