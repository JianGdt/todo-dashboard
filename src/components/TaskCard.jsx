/* eslint-disable react/prop-types */
export default function TaskCard({ task, handleDragStart, onEdit }) {
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
      </div>
    );
  };
  