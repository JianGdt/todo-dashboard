/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { updateTask } from "../../services/request.js";
import { toast } from "react-toastify";
import { FaRegClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import { clearDraft, saveDraft } from "../../store/tasks.js";
import { useDispatch, useSelector } from "react-redux";

const EditTask = ({ task, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const drafts = useSelector((state) => state.tasks.drafts || {}); // Ensure drafts is an object
 const [taskData, setTaskData] = useState(
    drafts[task.id] || {
      title: task.title || "",
      description: task.description || "",
      expiryDate: task.expiryDate && !isNaN(new Date(task.expiryDate))
      ? new Date(task.expiryDate).toISOString().split("T")[0] 
      : "",
    }
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saveDraft = setTimeout(async () => {
      if (hasChanges) {
        setIsSaving(true);
        try {
          const updatedTask = { ...task, ...taskData, expiryDate: new Date(taskData.expiryDate) };
          await updateTask(task.id, updatedTask);
          onUpdate(task.id, updatedTask);
          setIsSaving(false);
          toast.success("Changes saved!");
        } catch (error) {
          toast.error("Failed to save changes!", { error });
        }
      }
    }, 5000);

    return () => clearTimeout(saveDraft);
  }, [taskData, hasChanges, task.id, onUpdate]);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      dispatch(saveDraft({ taskId: task.id, content: taskData }));
    }, 5000);
    
    return () => clearTimeout(autoSave);
  }, [taskData, dispatch, task.id]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
    setHasChanges(true);
  };


  const handleSave = async () => {
    try {
      const updatedTask = { ...task, ...taskData, expiryDate: new Date(taskData.expiryDate) };
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transition-all transform scale-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Task Title"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Task Description"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={taskData.expiryDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Update History</h4>
          <div className="bg-gray-50 p-3 rounded-lg h-40 overflow-y-auto shadow-inner">
            {task.updates && task.updates.length > 0 ? (
              <ul className="space-y-3">
                {task.updates.map((update, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaRegClock className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-700">{update.action}</p>
                      <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No updates yet.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          {isSaving && (
            <p className="text-sm text-blue-500 flex items-center gap-1">
              <FaCheckCircle /> Saving...
            </p>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
