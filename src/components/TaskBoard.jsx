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
import { TODO_CATEGORIES } from "../constant/categories.jsx";
import TaskExpiryNotification from "./TaskExpiryNotification.jsx";
import TaskHistory from "./TaskHistory.jsx";

const TaskBoard = () => {
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector((state) => state.tasks);
    const [draggingTask, setDraggingTask] = useState(null);
    const [draggingOverCategory, setDraggingOverCategory] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        dispatch(loadTasks());
    }, [dispatch]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
            const taskMap = new Map();
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const taskId = typeof doc.id === "string" ? doc.id : String(doc.id?.id);
                const formattedExpiryDate =
                    data.expiryDate?.seconds
                        ? new Date(data.expiryDate.seconds * 1000).toISOString()
                        : null;

                if (!taskMap.has(taskId)) {
                    taskMap.set(taskId, {
                        id: taskId,
                        ...data,
                        expiryDate: formattedExpiryDate,
                    });
                }
            });
            const updatedTasks = Array.from(taskMap.values());
            if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
                dispatch(loadTasks.fulfilled(updatedTasks));
            }
        });

        return () => unsubscribe();
    }, [dispatch, tasks]);

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
        setDraggingTask(taskId);
    };

    const handleDrop = async (e, newCategory) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (!taskId) return;

        try {
            const task = tasks.find((taskId) => taskId.id === taskId);
            if (!task) return;
            const newUpdate = {
                timestamp: new Date().toISOString(),
                action: `Moved to ${newCategory}`,
            };
            const updatedTask = {
                category: newCategory,
                updates: [...task.updates, newUpdate],
            };
            await dispatch(editTask({ taskId, updatedFields: updatedTask }));
            dispatch(updateTaskState({ id: taskId, ...updatedTask }));
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
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const newUpdate = {
            timestamp: new Date().toISOString(),
            action: `Edited task`,
            changes: updatedTask,
        };

        dispatch(updateTaskState({ id: taskId, ...updatedTask, updates: [...task.updates, newUpdate] }));
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
            <TaskExpiryNotification tasks={tasks} />
            <button
                className="self-start bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setShowHistory(!showHistory)}
            >
                {showHistory ? "Close History" : "View History"}
            </button>
            <div className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform transform ${showHistory ? "translate-x-0" : "translate-x-full"} w-80 p-4`}>
                <TaskHistory tasks={tasks} />
            </div>
            <div className="flex gap-6">
                <AddTask />
                {TODO_CATEGORIES?.map((category) => (
                    <div
                        key={category}
                        onDrop={(e) => handleDrop(e, category)}
                        onDragOver={(e) => handleDragOver(e, category)}
                        className={`flex-1 p-4 rounded-lg shadow-md min-h-[300px] border-2 border-dashed transition-all ${draggingOverCategory === category ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-gray-100"
                            }`}
                    >
                        <h2 className="text-xl font-bold text-center mb-4">{category}</h2>
                        {tasks
                            .filter((task) => task.category === category && !task.deleted)
                            .map((task) => (
                                <TaskCard
                                    key={String(task.id)}
                                    onDelete={handleDelete}
                                    task={task}
                                    handleDragStart={handleDragStart}
                                    draggingTask={draggingTask}
                                    onEdit={() => setEditingTask(task)}
                                />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
