import { createContext, useContext, useState, ReactNode } from "react";

import type { Goal } from "../types";
import {
  getGoals as fetchGoals,
  createGoal as createGoalApi,
  updateGoal as updateGoalApi,
  deleteGoal as deleteGoalApi,
} from "../services/api";
import axios from "axios";

interface GoalContextType {
  goals: Goal[];
  loading: boolean;
  error: string;
  fetchGoals: () => Promise<void>;
  createGoal: (
    text: string,
    progress: number,
    dueDate: string
  ) => Promise<void>;
  updateGoal: (
    id: number,
    text: string,
    progress: number,
    dueDate: string
  ) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGoalsFunc = async () => {
    try {
      setLoading(true);
      const data = await fetchGoals();
      setGoals(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to fetch goals");
      }
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (
    text: string,
    progress: number,
    dueDate: string
  ) => {
    try {
      const response = await createGoalApi(text, progress, dueDate);
      setGoals([response.goal, ...goals]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error || "Failed to create goal");
      }
      throw err;
    }
  };

  const updateGoal = async (
    id: number,
    text: string,
    progress: number,
    dueDate: string
  ) => {
    try {
      const response = await updateGoalApi(id, text, progress, dueDate);
      setGoals(goals.map((g) => (g.id === id ? response.goal : g)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error || "Failed to update goal");
      }
      throw err;
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      await deleteGoalApi(id);
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error || "Failed to delete goal");
      }
      throw err;
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        loading,
        error,
        fetchGoals: fetchGoalsFunc,
        createGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoals must be used within GoalProvider");
  }
  return context;
};
