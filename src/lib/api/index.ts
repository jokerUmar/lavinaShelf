import axios from "axios";
import { api_constants } from "./constants";
import CryptoJS from "crypto-js";

function newAbortSignal(timeoutMs: number) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);
  return abortController.signal;
}

export const api = axios.create({
  baseURL: api_constants.baseUrl,
});

api.interceptors.request.use(
  (config) => {
    if (config.method === "get") {
      config.signal = newAbortSignal(15000);
    }
    if (String(config.headers.Authorization).toLowerCase() !== "basic") {
      let user_info: any = localStorage.getItem("user");
      if (user_info) {
        user_info = JSON.parse(user_info);
        config.headers.Authorization = user_info.access_token;
      }
      const method = config.method?.toUpperCase();
      const urlPath = config.url || "";
      const body = config.data ? JSON.stringify(config.data) : "";
      const secret = user_info.secret;
      const signstr = method + urlPath + body + secret;
      const sign = CryptoJS.MD5(signstr).toString();

      // console.log(signstr, " sign");
      // console.log(sign, " sign");

      config.headers.Key = user_info.key;
      config.headers.Sign = sign;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
