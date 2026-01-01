import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { Resource } from "../types";
import {
  getResources as fetchResources,
  createResource as createResourceApi,
  updateResource as updateResourceApi,
  deleteResource as deleteResourceApi,
} from "../services/api";
import axios from "axios";

interface ResourceContextType {
  resources: Resource[];
  loading: boolean;
  error: string;
  fetchResources: () => Promise<void>;
  createResource: (
    title: string,
    url: string,
    category: string
  ) => Promise<void>;
  updateResource: (
    id: number,
    title: string,
    url: string,
    category: string
  ) => Promise<void>;
  deleteResource: (id: number) => Promise<void>;
}

const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined
);

export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResourcesFunc = async () => {
    try {
      setLoading(true);
      const data = await fetchResources();
      setResources(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to fetch resources");
      }
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (
    title: string,
    url: string,
    category: string
  ) => {
    try {
      const response = await createResourceApi(title, url, category);
      setResources([response.resource, ...resources]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to create resource"
        );
      }
      throw err;
    }
  };

  const updateResource = async (
    id: number,
    title: string,
    url: string,
    category: string
  ) => {
    try {
      const response = await updateResourceApi(id, title, url, category);
      setResources(resources.map((r) => (r.id === id ? response.resource : r)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to update resource"
        );
      }
      throw err;
    }
  };

  const deleteResource = async (id: number) => {
    try {
      await deleteResourceApi(id);
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to delete resource"
        );
      }
      throw err;
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        resources,
        loading,
        error,
        fetchResources: fetchResourcesFunc,
        createResource,
        updateResource,
        deleteResource,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResources must be used within ResourceProvider");
  }
  return context;
};
