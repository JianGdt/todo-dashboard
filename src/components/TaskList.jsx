import { useState, useEffect } from "react";
import { getTasks, addTask, deleteTask } from "../services/TaskService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask({ title: newTask, status: "To Do" });
    setNewTask("");
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={handleAddTask}>Add</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => handleDeleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
