import { useState, useEffect } from "react";
import { useGoals } from "../../context/GoalContext";
import type { Goal } from "../../types";

interface GoalModalProps {
  goal: Goal | null;
  onClose: () => void;
}

export default function GoalModal({ goal, onClose }: GoalModalProps) {
  const { createGoal, updateGoal } = useGoals();
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setText(goal.text);
      setProgress(goal.progress);

      try {
        const date = new Date(goal.due_date);
        const formattedDate = date.toISOString().split("T")[0];
        setDueDate(formattedDate);
      } catch (err) {
        console.error("Date parse error:", err);
        setDueDate("");
      }
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (goal) {
        await updateGoal(goal.id, text, progress, dueDate);
      } else {
        await createGoal(text, progress, dueDate);
      }
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 animate-slideUp">
        <h3 className="text-xl font-bold text-white mb-4">
          {goal ? "Edit Goal" : "Add New Goal"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Goal
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Complete DevBoard project"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full"
            />
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : goal ? "Update" : "Add Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
