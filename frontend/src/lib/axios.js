import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // This tells browser to include credentials ( cookies,HTTP auth, client certifcates ) when sending requests
});

