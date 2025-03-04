// src/hooks/useRole.js
import { useSelector } from "react-redux";

export const useRole = () => {
  const role = useSelector((state) => state.user); // Adjust based on your Redux state structure
  return role?.role_with_permission;
};
