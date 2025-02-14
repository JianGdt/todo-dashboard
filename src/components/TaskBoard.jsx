/* eslint-disable no-undef */
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { loadTasks, editTask, updateTaskState } from "../store/tasks.js";
import EditTask from "./modal/EditTask.jsx";
import { db } from "../firebase/config.js";
import { toast } from "react-toastify";
import { deleteTask } from "../services/request.js";

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingOverCategory, setDraggingOverCategory] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  console.log("tasks", tasks);

  useEffect(() => {
    dispatch(loadTasks()); 
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
        const taskList = snapshot.docs.map((doc) => {
            const data = doc.data();
            let expiryDate = null;
          
            if (data.expiryDate) {
              try {
                expiryDate = data.expiryDate.seconds
                  ? new Date(data.expiryDate.seconds * 1000).toISOString()
                  : null;
              } catch (error) {
                console.error("Invalid expiryDate:", data.expiryDate, error.message);
                expiryDate = null;
              }
            }
          
            return {
              id: doc.id,
              ...data,
              expiryDate, 
            };
          });
          
  
      dispatch(loadTasks.fulfilled(taskList));
    });
  
    return () => unsubscribe();
  }, [dispatch]);
  

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    setDraggingTask(taskId);
  };

  const handleDrop = async (e, newCategory) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    try {
      await dispatch(editTask({ taskId, updatedFields: { category: newCategory } }));
      dispatch(updateTaskState({ id: taskId, category: newCategory }));
    } catch (error) {
      console.error("Error updating task category:", error);
    }

    setDraggingTask(null);
    setDraggingOverCategory(null);
  };

  const handleDragOver = (e, category) => {
    e.preventDefault();
    setDraggingOverCategory(category);
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    dispatch(updateTaskState({ id: taskId, ...updatedTask }));
  };


  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      dispatch(updateTaskState({ id: taskId, deleted: true }));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task!");
      console.error("Delete error:", error);
    }
  };
  

  if (loading) return <p className="text-center text-lg font-semibold">Loading tasks...</p>;

  return (
    <div className="flex flex-col gap-6 p-6">
      {editingTask && <EditTask onUpdate={handleUpdateTask} task={editingTask} onClose={() => setEditingTask(null)} />}
      <div className="flex gap-6">
        <AddTask />
        {["To Do", "In Progress", "Done"].map((category) => (
          <div
            key={category}
            onDrop={(e) => handleDrop(e, category)}
            onDragOver={(e) => handleDragOver(e, category)}
            className={`flex-1 p-4 rounded-lg shadow-md min-h-[300px] border-2 border-dashed transition-all ${
              draggingOverCategory === category ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-gray-100"
            }`}
          >
            <h2 className="text-xl font-bold text-center mb-4">{category}</h2>
            {tasks
                .filter((task) => task.category === category)
                .map((task) => (
                    <TaskCard key={task.id} onDelete={handleDelete} task={task} handleDragStart={handleDragStart} draggingTask={draggingTask} onEdit={() => setEditingTask(task)} />
                ))}
            </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
