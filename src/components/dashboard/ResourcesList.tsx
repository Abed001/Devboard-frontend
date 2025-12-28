import { useState } from "react";
import { Plus, Bookmark, ExternalLink, Trash2, Edit2 } from "lucide-react";
import { useResources } from "../../context/ResourceContext";
import type { Resource } from "../../types";
import ResourceModal from "./ResourceModal";

export default function ResourcesList() {
  const { resources, deleteResource } = useResources();
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    try {
      await deleteResource(id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingResource(null);
  };

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
    <>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bookmark className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">
                Saved Resources
              </h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>
        </div>

        {resources.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No resources yet. Add your first one!
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="p-6 hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">
                      {resource.title}
                    </h4>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 text-sm mb-2 hover:underline inline-flex items-center gap-1"
                    >
                      {resource.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2">
                      <span className="px-2 py-1 bg-slate-700 rounded">
                        {resource.category}
                      </span>
                      <span>Added {getTimeAgo(resource.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="p-2 hover:bg-slate-600 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="p-2 hover:bg-slate-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ResourceModal
          resource={editingResource}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
