import axios from "axios";
import type { User, Resource, Goal, GithubRepo } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth response type (this one is API-specific, so keep it here)
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// ============================================
// AUTH API
// ============================================

export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/signup", {
    name,
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

// ============================================
// RESOURCES API
// ============================================

export const getResources = async () => {
  const response = await api.get<Resource[]>("/resources");
  return response.data;
};

export const createResource = async (
  title: string,
  url: string,
  category: string
) => {
  const response = await api.post<{ message: string; resource: Resource }>(
    "/resources",
    {
      title,
      url,
      category,
    }
  );
  return response.data;
};

export const updateResource = async (
  id: number,
  title: string,
  url: string,
  category: string
) => {
  const response = await api.patch<{ message: string; resource: Resource }>(
    `/resources/${id}`,
    {
      title,
      url,
      category,
    }
  );
  return response.data;
};

export const deleteResource = async (id: number) => {
  const response = await api.delete<{ message: string }>(`/resources/${id}`);
  return response.data;
};

// ============================================
// GOALS API
// ============================================

export const getGoals = async () => {
  const response = await api.get<Goal[]>("/goals");
  return response.data;
};

export const createGoal = async (
  text: string,
  progress: number,
  due_date: string
) => {
  const response = await api.post<{ message: string; goal: Goal }>("/goals", {
    text,
    progress,
    due_date,
  });
  return response.data;
};

export const updateGoal = async (
  id: number,
  text: string,
  progress: number,
  due_date: string
) => {
  const response = await api.patch<{ message: string; goal: Goal }>(
    `/goals/${id}`,
    {
      text,
      progress,
      due_date,
    }
  );
  return response.data;
};

export const deleteGoal = async (id: number) => {
  const response = await api.delete<{ message: string }>(`/goals/${id}`);
  return response.data;
};

// ============================================
// GITHUB API
// ============================================

export const getGithubRepos = async (username: string) => {
  const response = await api.get<GithubRepo[]>(
    `/github/repos?username=${username}`
  );
  return response.data;
};

export default api;
