import { useState, useEffect } from "react";
import { updateTask } from "../services/TaskService";

const EditTask = ({ task }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saveDraft = setTimeout(() => {
      if (title !== task.title || description !== task.description) {
        setIsSaving(true);
        updateTask(task.id, { title, description })
          .then(() => setIsSaving(false));
      }
    }, 1000); // Auto-save every 1 second

    return () => clearTimeout(saveDraft);
  }, [title, description, task.id]);

  return (
    <div style={{ margin: "10px 0", padding: "10px", background: "white", borderRadius: "5px" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", fontSize: "16px", fontWeight: "bold" }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", minHeight: "50px", marginTop: "5px" }}
      />
      {isSaving && <p style={{ color: "gray", fontSize: "12px" }}>Saving...</p>}
    </div>
  );
};

export default EditTask;
