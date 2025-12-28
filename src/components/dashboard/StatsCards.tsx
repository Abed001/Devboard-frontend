import { Bookmark, Target, Github } from "lucide-react";
import { useResources } from "../../context/ResourceContext";
import { useGoals } from "../../context/GoalContext";

interface StatsCardsProps {
  githubReposCount: number;
}

export default function StatsCards({ githubReposCount }: StatsCardsProps) {
  const { resources } = useResources();
  const { goals } = useGoals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <Bookmark className="w-8 h-8 text-white/80" />
          <span className="text-purple-200 text-sm">Total</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {resources.length}
        </div>
        <div className="text-purple-200 text-sm">Saved Resources</div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <Target className="w-8 h-8 text-white/80" />
          <span className="text-blue-200 text-sm">Active</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{goals.length}</div>
        <div className="text-blue-200 text-sm">Current Goals</div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <Github className="w-8 h-8 text-white/80" />
          <span className="text-green-200 text-sm">Public</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {githubReposCount}
        </div>
        <div className="text-green-200 text-sm">GitHub Repos</div>
      </div>
    </div>
  );
}
