"use client";

import axios from "axios";
import { getHeaderConfig, clearAuthInfo } from "./utils";
import { baseUrl } from "./app.config";
import { toast as reToast } from "react-hot-toast";

export let api = axios.create({
  baseURL: baseUrl,
});

export function updateAxiosHeader(accessToken) {
  api.defaults.headers = getHeaderConfig(
    accessToken.verify_access_token
  ).headers;

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (
        error.response?.status === 401 &&
        error.response?.data?.message == "please login first"
      ) {
        console.log(error.message);
        clearAuthInfo();
        window.location.replace("/auth/login");
      } else {
        window.location.replace("/error-page/403");
      }
      return Promise.reject(error);
    }
  );
}
