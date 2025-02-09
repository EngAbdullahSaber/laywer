'use client'


import axios from "axios";
import { getHeaderConfig, clearAuthInfo } from './utils'
import { baseUrl } from './app.config';


export let api = axios.create({
    baseURL: baseUrl,
    headers: getHeaderConfig().headers
 })


 export function updateAxiosHeader(){
    api=axios.create({
        baseURL: baseUrl,
        headers: getHeaderConfig().headers
     })
     
     api.interceptors.response.use(function (response) {
        return response;
        }, function (error) {
          if(error.response.status == 401){
              clearAuthInfo()
              window.location.reload(true);
        }
    });
}

 