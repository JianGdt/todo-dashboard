/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import { fetchTasks } from "../services/request.js";
import { editTask, setTasks, updateTaskState } from "../store/tasks.js";
import EditTask from "./modal/EditTask.jsx";

const TaskBoard = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const [loading, setLoading] = useState(true);
    const [draggingTask, setDraggingTask] = useState(null);
    const [draggingOverCategory, setDraggingOverCategory] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
  
    useEffect(() => {
      const loadTasks = async () => {
        setLoading(true);
        const taskList = await fetchTasks();
        dispatch(setTasks(taskList));
        setLoading(false);
      };
      loadTasks();
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
        await dispatch(editTask(taskId, { category: newCategory }));
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
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
        );
      };
  
    if (loading) return <p className="text-center text-lg font-semibold">Loading tasks...</p>;
  
    return (
      <div className="flex flex-col gap-6 p-6">
        {editingTask && <EditTask  onUpdate={handleUpdateTask} task={editingTask} onClose={() => setEditingTask(null)} />}
        <div className="flex gap-6">
          <AddTask />
          {["To Do", "In Progress", "Done"].map((category) => (
            <div
              key={category}
              onDrop={(e) => handleDrop(e, category)}
              onDragOver={(e) => handleDragOver(e, category)}
              className={`flex-1 p-4 rounded-lg shadow-md min-h-[300px] border-2 border-dashed transition-all ${draggingOverCategory === category ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-gray-100"}`}
            >
              <h2 className="text-xl font-bold text-center mb-4">{category}</h2>
              {tasks.filter((task) => task.category === category).map((task) => (
                <TaskCard key={task.id} task={task} handleDragStart={handleDragStart} draggingTask={draggingTask} onEdit={() => setEditingTask(task)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
export default TaskBoard;
