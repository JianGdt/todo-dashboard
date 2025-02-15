/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function TaskCard({ task, handleDragStart, onEdit, onDelete, draggingTask }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDelete = useCallback((e) => {
        e.stopPropagation();
        onDelete(task.id);
    }, [task.id, onDelete]);

    return (
        <motion.div
            draggable
            onDragStart={(e) => {
                handleDragStart(e, task.id);
                setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
            onClick={onEdit}
            animate={{ 
                scale: isDragging ? 1.05 : 1, 
                opacity: draggingTask === task.id ? 0.5 : 1,
                rotate: isDragging ? -2 : 0,
                skewX: isDragging ? "-5deg" : "0deg"
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative bg-white p-5 rounded-lg shadow-lg border border-gray-300 cursor-pointer hover:shadow-xl transition-all"
        >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{task.description || "No description"}</p>
            <p className="text-xs text-red-500 font-medium">
                Expiry: {task.expiryDate ? new Date(task.expiryDate).toDateString() : "No Date"}
            </p>
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-1.5 rounded-full text-red-600 hover:text-red-800 transition"
            >
                <FaTrash size={16} />
            </button>
        </motion.div>
    );
}
