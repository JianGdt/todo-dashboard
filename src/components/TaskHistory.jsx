/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const TaskHistory = ({ tasks, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const trackHistory = () => {
      const updates = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        updatedAt: task.updatedAt || new Date().toISOString(),
        category: task.category,
      }));
      setHistory(updates);
    };
    trackHistory();
  }, [tasks]);

  return (
    <div className="fixed top-0 right-0 h-full bg-white shadow-lg transition-transform transform translate-x-0 w-80 p-4 overflow-y-auto">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
      <h2 className="text-lg font-semibold mb-4">Task History</h2>
      <ul className="space-y-2">
        {history.map((entry) => (
          <li key={entry.id} className="p-2 border rounded-lg">
            <p className="text-sm">
              <strong>{entry.title}</strong> moved to <span className="font-semibold">{entry.category}</span>
            </p>
            <p className="text-xs text-gray-500">Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskHistory;
