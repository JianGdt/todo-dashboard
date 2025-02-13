import { useState } from "react";
import { addTask } from "../services/TaskService";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !expiryDate) {
      alert("Title and Expiry Date are required!");
      return;
    }
    await addTask({ title, description, expiryDate });
    setTitle("");
    setDescription("");
    setExpiryDate("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input 
        type="text" 
        placeholder="Task Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="Task Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <input 
        type="date" 
        value={expiryDate} 
        onChange={(e) => setExpiryDate(e.target.value)} 
        required 
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;
