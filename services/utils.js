"use client";

import { headerConfigKeyName } from "./app.config";


export function getHeaderConfig() {
  const token = localStorage.getItem(headerConfigKeyName);

  if (typeof localStorage !== "undefined" && token) {
    try {
      // Try to parse the token to ensure it's valid JSON
      const parsedToken = JSON.parse(token);

      return {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${parsedToken}`,
        },
      };
    } catch (error) {
      // In case of JSON parsing error, log it and return a safe config
      console.error("Error parsing token from localStorage:", error);
      return {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "Accept-Language": "en",
        },
      };
    }
  } else {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "Accept-Language": "en",
      },
    };
  }
}


export const storeTokenInLocalStorage = (token) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(headerConfigKeyName, JSON.stringify(token));
  }
};
export const RemoveTokenInLocalStorage = () => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(headerConfigKeyName);
  }
};
export function getToken() {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(headerConfigKeyName);
  }
  return null; // If localStorage is not available
}

export function clearAuthInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(headerConfigKeyName);
  }
}

export function makeFilterString(filter_obj) {
  var filterString = "?";
  Object.keys(filter_obj).map(function (key) {
    if (filter_obj[key] != null) {
      filterString += key + "=" + filter_obj[key] + "&";
    } else {
      return false;
    }
  });

  return filterString;
}
