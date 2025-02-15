/* eslint-disable react/prop-types */
import { useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const TaskExpiryNotification = ({ tasks }) => {
    const showExpiryWarning = useCallback(() => {
        const now = Date.now();
        const soonestTask = tasks
            .map(task => ({ ...task, expiry: new Date(task.expiryDate || "") }))
            .filter(task => !isNaN(task.expiry) && (task.expiry - now) / 86400000 <= 1)
            .sort((a, b) => a.expiry - b.expiry)[0];

        soonestTask && toast.warning(`Task "${soonestTask.title}" is expiring soon!`, { toastId: "expiry-warning" });
    }, [tasks]);

    useEffect(showExpiryWarning, [showExpiryWarning]);
    return null;
};

export default TaskExpiryNotification;
