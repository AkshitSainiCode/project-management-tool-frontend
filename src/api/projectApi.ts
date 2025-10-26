// import axios from "axios";
// // import { Project } from "../types/project";
// import type { Project } from "../types/project";

// const API_URL = "http://localhost:5000/api/projects";

// export const getProjects = async (token: string) => {
//   return axios.get<Project[]>(API_URL, { headers: { Authorization: `Bearer ${token}` } });
// };

// export const getProjectById = async (id: string, token: string) => {
//   return axios.get<Project>(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
// };

// export const createProject = async (data: { title: string; description: string; status: "active" | "completed" }, token: string) => {
//   return axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
// };

// export const updateProject = async (id: string, data: Partial<{ title: string; description: string; status: "active" | "completed" }>, token: string) => {
//   return axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
// };

// export const deleteProject = async (id: string, token: string) => {
//   return axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
// };


//////////////

import axios from "axios";
import type { Project } from "../types/project";

const API_URL = "http://localhost:5000/api/projects";

export const getProjects = async (token: string) => {
  return axios.get<Project[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProjectById = async (id: string, token: string) => {
  return axios.get<Project>(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createProject = async (
  data: { title: string; description: string; status: "active" | "completed" },
  token: string
) => {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProject = async (
  id: string,
  data: Partial<{ title: string; description: string; status: "active" | "completed" }>,
  token: string
) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteProject = async (id: string, token: string) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
