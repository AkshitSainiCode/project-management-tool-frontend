import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getProfile: () =>
    api.get('/auth/profile')
};

// Projects API
export const projectsAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get('/projects', { params }),
  
  getById: (id: string) =>
    api.get(`/projects/${id}`),
  
  create: (data: { title: string; description: string; status?: string }) =>
    api.post('/projects', data),
  
  update: (id: string, data: { title?: string; description?: string; status?: string }) =>
    api.put(`/projects/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/projects/${id}`)
};

// Tasks API
export const tasksAPI = {
  getByProject: (projectId: string, status?: string) =>
    api.get(`/tasks/project/${projectId}`, { params: { status } }),
  
  getById: (id: string) =>
    api.get(`/tasks/${id}`),
  
  create: (data: { 
    title: string; 
    description: string; 
    dueDate: string; 
    projectId: string; 
    status?: string 
  }) =>
    api.post('/tasks', data),
  
  update: (id: string, data: { 
    title?: string; 
    description?: string; 
    status?: string;
    dueDate?: string;
    projectId?: string;
  }) =>
    api.put(`/tasks/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/tasks/${id}`)
};

export default api;