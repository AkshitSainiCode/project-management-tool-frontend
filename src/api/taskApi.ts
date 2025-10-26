import axios from "axios";
import  type { Task } from "../types/task";

const API_URL = "http://localhost:5000/api/tasks";

export const getTasksByProject = async (projectId: string, token: string, status?: string) => {
  return axios.get<Task[]>(`${API_URL}/project/${projectId}`, { 
    headers: { Authorization: `Bearer ${token}` },
    params: status ? { status } : {}
  });
};

export const createTask = async (data: { title: string; description: string; status: "todo" | "in-progress" | "done"; dueDate: string; projectId: string }, token: string) => {
  return axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateTask = async (id: string, data: Partial<{ title: string; description: string; status: "todo" | "in-progress" | "done"; dueDate: string }>, token: string) => {
  return axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteTask = async (id: string, token: string) => {
  return axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
