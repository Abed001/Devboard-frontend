export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Resource {
  id: number;
  user_id?: number;
  title: string;
  url: string;
  category: string;
  created_at: string; // ← Remove the ? to make it required
}

export interface Goal {
  id: number;
  user_id?: number;
  text: string;
  progress: number;
  due_date: string; // ← Remove the ? to make it required
  created_at: string; // ← Remove the ? to make it required
}

export interface GithubRepo {
  id: number;
  name: string;
  description?: string;
  url: string;
  stars: number;
  forks?: number;
  language: string;
  updated: string;
  created?: string;
  isPrivate?: boolean;
}
