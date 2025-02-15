import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTasks, editTask, updateTaskState } from "../store/tasks.js";
import { db } from "../firebase/config.js";
import { toast } from "react-toastify";
import { deleteTask } from "../services/request.js";
import { TODO_CATEGORIES } from "../constant/categories.jsx";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import EditTask from "./modal/EditTask.jsx";
import TaskExpiryNotification from "./TaskExpiryNotification.jsx";
import TaskHistory from "./TaskHistory.jsx";
import { motion } from "framer-motion";

const TaskBoard = () => {
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector((state) => state.tasks);
    const [draggingTask, setDraggingTask] = useState(null);
    const [draggingOverCategory, setDraggingOverCategory] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [showExpiryPopup, setShowExpiryPopup] = useState(false);

    useEffect(() => {
        dispatch(loadTasks());
    }, [dispatch]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
            const updatedTasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                expiryDate: doc.data().expiryDate?.seconds
                    ? new Date(doc.data().expiryDate.seconds * 1000).toISOString()
                    : null,
            }));
            if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
                dispatch(loadTasks.fulfilled(updatedTasks));
            }
        });

        return () => unsubscribe();
    }, [dispatch, tasks]);

    useEffect(() => {
        const nearExpiryTask = tasks.find(task => {
            if (!task.expiryDate) return false;
            const expiryTime = new Date(task.expiryDate).getTime();
            const now = Date.now();
            return expiryTime - now < 48 * 60 * 60 * 1000; 
        });
        if (nearExpiryTask) setShowExpiryPopup(true);
    }, [tasks]);

    const handleClosePopup = () => {
        setShowExpiryPopup(false);
    };

    const handleDragStart = useCallback((e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
        setDraggingTask(taskId);
    }, []);

    const handleDrop = useCallback(async (e, newCategory) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (!taskId) return;
        try {
            const task = tasks.find((task) => task.id === taskId);
            if (!task) return;

            const updatedTask = {
                ...task,
                category: newCategory,
                updates: [
                    ...(task.updates || []),
                    { timestamp: new Date().toISOString(), action: `Moved to ${newCategory}` },
                ],
            };
            await dispatch(editTask({ taskId, updatedFields: updatedTask }));
            dispatch(updateTaskState({ id: taskId, ...updatedTask }));
        } catch (error) {
            console.error("Error updating task category:", error);
        }
        setDraggingTask(null);
        setDraggingOverCategory(null);
    }, [tasks, dispatch]);

    const handleDragOver = useCallback((e, category) => {
        e.preventDefault();
        setDraggingOverCategory(category);
    }, []);

    const handleUpdateTask = useCallback((taskId, updatedTask) => {
        const task = tasks.find((task) => task.id === taskId);
        if (!task) return;

        dispatch(
            updateTaskState({
                id: taskId,
                ...updatedTask,
                updates: [...(task.updates || []), { timestamp: new Date().toISOString(), action: "Edited task" }],
            })
        );
    }, [tasks, dispatch]);

    const handleDelete = useCallback(async (taskId) => {
        try {
            if (!taskId) throw new Error("Task ID is undefined or null");
            await deleteTask(taskId);
            dispatch(updateTaskState({ id: taskId, deleted: true }));
            toast.success("Task deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete task!");
            console.error("Delete error:", error);
        }
    }, [dispatch]);

    const filteredTasks = useMemo(() => tasks.filter((task) => !task.deleted), [tasks]);

    if (loading) return <p className="text-center text-lg font-semibold">Loading tasks...</p>;

    return (
        <div className="p-4">
            {showExpiryPopup && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <p>⚠️ Some tasks are nearing expiry!</p>
                    <button className="ml-2 underline" onClick={handleClosePopup}>Dismiss</button>
                </div>
            )}

            {editingTask && editingTask.id && (
                <EditTask 
                    onUpdate={handleUpdateTask} 
                    task={editingTask} 
                    onClose={() => setEditingTask(null)} 
                />
            )}
            
            <TaskExpiryNotification tasks={filteredTasks} />
            <button
                className="self-start bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => setShowHistory((prev) => !prev)}
            >
                {showHistory ? "Close History" : "View History"}
            </button>
            
            <motion.div 
                className="fixed top-0 right-0 h-full bg-white shadow-lg w-80 p-4 z-50"
                animate={{ x: showHistory ? 0 : 320 }}
                transition={{ type: "spring", stiffness: 150 }}
            >
                <TaskHistory tasks={filteredTasks} />
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6">
                <AddTask />
                
                {TODO_CATEGORIES?.map((category) => (
                    <motion.div
                        key={category}
                        onDrop={(e) => handleDrop(e, category)}
                        onDragOver={(e) => handleDragOver(e, category)}
                        className={`flex flex-col w-full md:w-80 min-h-[600px] bg-white rounded-lg shadow-lg p-4 border transition-all ${
                            draggingOverCategory === category ? "border-blue-500 bg-blue-100" : "border-gray-300"
                        }`}
                    >
                        <h2 className="text-lg font-bold text-gray-800 text-center mb-3">{category}</h2>
                        <div className="flex flex-col gap-3 overflow-y-auto h-full">
                            {filteredTasks
                                .filter((task) => task.category === category)
                                .map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        onDelete={handleDelete}
                                        task={task}
                                        handleDragStart={handleDragStart}
                                        draggingTask={draggingTask}
                                        onEdit={() => setEditingTask(task)}
                                    />
                                ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
