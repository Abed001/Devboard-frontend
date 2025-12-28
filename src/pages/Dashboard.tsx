import { useState, useCallback, useEffect } from "react";
import { useResources } from "../context/ResourceContext";
import { useGoals } from "../context/GoalContext";
import { getGithubRepos } from "../services/api";
import type { GithubRepo } from "../types";
import Header from "../components/dashboard/Header";
import StatsCards from "../components/dashboard/StatsCards";
import ResourcesList from "../components/dashboard/ResourcesList";
import GoalsList from "../components/dashboard/GoalsList";
import GithubRepos from "../components/dashboard/GithubRepos";

export default function Dashboard() {
  const { fetchResources, loading: resourcesLoading } = useResources();
  const { fetchGoals, loading: goalsLoading } = useGoals();
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);

  const loadData = useCallback(async () => {
    await Promise.all([fetchResources(), fetchGoals()]);
    try {
      const repos = await getGithubRepos("Abed001");
      setGithubRepos(repos);
    } catch (err) {
      console.log("GitHub fetch optional:", err);
    }
  }, [fetchResources, fetchGoals]);

  useEffect(() => {
    // Define the initial load logic here to run only on mount
    const initialLoad = async () => {
      await Promise.all([fetchResources(), fetchGoals()]);
      try {
        const repos = await getGithubRepos("Abed001");
        setGithubRepos(repos);
      } catch (err) {
        console.log("GitHub fetch optional:", err);
      }
    };
    initialLoad();
  }, []); // Empty dependency array ensures this runs only on mount

  if (resourcesLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-slate-400">
            Here's what's happening with your projects today
          </p>
        </div>

        <StatsCards githubReposCount={githubRepos.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ResourcesList />
            <GoalsList />
          </div>

          <div className="space-y-8">
            <GithubRepos
              repos={githubRepos}
              onSync={loadData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
