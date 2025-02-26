"use client";

import axios from "axios";
import { getHeaderConfig, clearAuthInfo } from "./utils";
import { baseUrl } from "./app.config";

export let api = axios.create({
  baseURL: baseUrl,
});

export function updateAxiosHeader(accessToken) {
  console.log(accessToken);
  api.defaults.headers = getHeaderConfig(
    accessToken.verify_access_token
  ).headers;

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.status === 401) {
        console.log(error);
        clearAuthInfo();
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );
}
