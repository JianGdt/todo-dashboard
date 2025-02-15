/* eslint-disable no-undef */
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addNewTask, createTask } from "../store/tasks.js";

const AddTask = () => {
    const dispatch = useDispatch();
    const [task, setTask] = useState({ title: "", description: "", expiryDate: "" });
    const handleChange = (e) => {
      setTask({ ...task, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.title || !task.expiryDate) {
          return toast.error("Title and Expiry Date are required!");
        }
        try {
          const newTask = { ...task, category: "To Do" };
          const taskId = await dispatch(createTask(newTask)).unwrap();
          if (taskId) {
            dispatch(addNewTask({ id: taskId, ...newTask }));
            toast.success("Task added successfully!");
            setTask({ title: "", description: "", expiryDate: "" });
          } else {
            throw new Error("Task creation failed");
          }
        } catch (error) {
          toast.error("Failed to add task. Please try again.", { error });
        }
      };
      
  
    return (
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Add New Task</h2>
        <input type="text" name="title" placeholder="Task Title" value={task.title} onChange={handleChange}  className="p-2 border rounded-lg" />
        <textarea name="description" placeholder="Task Description" value={task.description} onChange={handleChange} className="p-2 border rounded-lg" />
        <input type="date" name="expiryDate" value={task.expiryDate} onChange={handleChange}  className="p-2 border rounded-lg" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Add Task</button>
      </form>
    );
  };

export default AddTask;
