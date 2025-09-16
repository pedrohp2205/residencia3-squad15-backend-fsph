import axios from "axios";

export const fpshApi = axios.create({
  baseURL: process.env.FPSH_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
