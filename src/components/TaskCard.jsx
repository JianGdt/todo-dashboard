/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";

export default function TaskCard({ task, handleDragStart, onEdit, onDelete  }) {
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onClick={onEdit} 
        className="bg-white p-4 mb-3 rounded-lg shadow-lg cursor-pointer"
      >
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-gray-600">{task.description || "No description"}</p>
        <p className="text-red-500 text-sm">Expiry: {task.expiryDate ? new Date(task.expiryDate).toDateString() : "No Date"}</p>
        <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering onEdit when clicking delete
          onDelete(task.id);
        }}
        className="mt-2 flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
      >
        <FaTrash size={14} /> Delete
      </button>
      </div>
    );
  };
  