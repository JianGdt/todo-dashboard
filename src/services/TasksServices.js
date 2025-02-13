import { db } from "../firebase/config.js"
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const tasksCollectionRef = collection(db, "tasks");

export const addTask = async (task) => {
  return await addDoc(tasksCollectionRef, {
    title: task.title,
    description: task.description,
    expiryDate: task.expiryDate,
    category: task.category || "To Do",
  });
};

export const updateTask = async (taskId, updatedFields) => {
  const taskDoc = doc(db, "tasks", taskId);
  return await updateDoc(taskDoc, updatedFields);
};

export const getTasks = async () => {
  const snapshot = await getDocs(tasksCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};