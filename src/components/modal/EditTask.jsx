/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { updateTask } from "../../services/request.js";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { clearDraft, saveDraft } from "../../store/tasks.js";
import { useDispatch, useSelector } from "react-redux";
import { TODO_CATEGORIES } from "../../constant/categories.jsx";

const EditTask = ({ task, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const drafts = useSelector((state) => state.tasks.drafts || {});
  const [taskData, setTaskData] = useState(
    drafts[task.id] || {
      title: task.title || "",
      description: task.description || "",
      expiryDate:
        task.expiryDate && !isNaN(new Date(task.expiryDate))
          ? new Date(task.expiryDate).toISOString().split("T")[0]
          : "",
      category: task.category || "To Do",
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      dispatch(saveDraft({ taskId: task.id, content: taskData }));
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 5000);
    return () => clearTimeout(autoSave);
  }, [taskData, dispatch, task.id]);

  const handleChange = (e) => {
    const updatedData = { ...taskData, [e.target.name]: e.target.value };
    setTaskData(updatedData);
    dispatch(saveDraft({ taskId: task.id, content: updatedData }));
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...task,
        ...taskData,
        expiryDate: new Date(taskData.expiryDate),
      };
      await updateTask(task.id, updatedTask);
      onUpdate(task.id, updatedTask);
      dispatch(clearDraft(task.id));
      toast.success("Task updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update task!", { error });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
            <FaTimes size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Task Title"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={taskData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {TODO_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Task Description"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={taskData.expiryDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {isSaving && (
            <p className="text-sm text-blue-500 flex items-center gap-1 animate-pulse">
              <FaCheckCircle /> Saving...
            </p>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            Save
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition font-semibold shadow-md">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditTask;
