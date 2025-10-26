import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const register = (data: { name: string; email: string; password: string }) =>
  axios.post(`${API_URL}/register`, data);

export const login = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/login`, data);
