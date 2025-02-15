/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { toast } from "react-toastify";

const TaskExpiryNotification = ({ tasks }) => {
    useEffect(() => {
      const now = new Date();
      tasks.forEach((task) => {
        const expiry = new Date(task.expiryDate);
        const timeDiff = (expiry - now) / (1000 * 60 * 60 * 24);
        if (timeDiff <= 1 && timeDiff > 0) {
          toast.warning(`Task "${task.title}" is expiring soon!`);
        }
      });
    }, [tasks]);
  
    return null;
  };
  
  export default TaskExpiryNotification;