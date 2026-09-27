import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getStatus = () => {
  return API.get("/status");
};

export const getDevices = () => {
  return API.get("/devices");
};

export const getAlerts = () => {
  return API.get("/alerts");
};