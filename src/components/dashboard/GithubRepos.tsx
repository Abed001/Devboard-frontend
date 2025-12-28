import { Github, ExternalLink } from "lucide-react";
import type { GithubRepo } from "../../types";

interface GithubReposProps {
  repos: GithubRepo[];
  onSync: () => void;
}

export default function GithubRepos({ repos, onSync }: GithubReposProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} weeks ago`;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Github className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-semibold text-white">GitHub Repos</h3>
          </div>
          <button
            onClick={onSync}
            className="text-sm text-green-400 hover:text-green-300"
          >
            Sync
          </button>
        </div>
      </div>

      {repos.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No repos found</div>
      ) : (
        <div className="divide-y divide-slate-700">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="p-6 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-white font-semibold">{repo.name}</h4>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400 hover:text-white" />
                </a>
              </div>
              {repo.description && (
                <p className="text-sm text-slate-400 mb-3">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                {repo.language && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span>{repo.language}</span>
                  </span>
                )}
                <span>⭐ {repo.stars}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Updated {getTimeAgo(repo.updated)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
