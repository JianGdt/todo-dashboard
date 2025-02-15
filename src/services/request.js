import { db } from "../firebase/config.js";
import { Timestamp } from "firebase/firestore";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

const tasksCollectionRef = collection(db, "tasks");

export const addTask = async (taskData) => {
  console.log('addTask', taskData);
  if (!taskData || typeof taskData !== "object") {
    throw new Error("Invalid task data");
  }
  try {
    const docRef = await addDoc(collection(db, "tasks"), { 
      title: taskData.title || "Untitled Task",
      description: taskData.description || "",
      expiryDate: taskData.expiryDate ? Timestamp.fromDate(new Date(taskData.expiryDate)) : null,
      category: taskData.category || "To Do",
      updates: [],  
    });
    if (!docRef.id) throw new Error("Task ID is undefined");
    return { id: docRef.id, ...taskData };
  } catch (error) {
    console.error("Error adding task:", error);
    throw new Error("Failed to add task");
  }
};



export const fetchTasks = async () => {
  try {
    const snapshot = await getDocs(collection(db, "tasks"));
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate.seconds * 1000).toISOString() : null,
      };
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Promise.reject("Failed to load tasks");
  }
};




export const updateTask = async (taskId, updatedFields) => {
  const taskDoc = doc(db, "tasks", taskId);
  const taskSnapshot = await getDoc(taskDoc);
  if (!taskSnapshot.exists()) return;
  let validExpiryDate = null;
  if (updatedFields.expiryDate) {
    if (updatedFields.expiryDate instanceof Timestamp) {
      validExpiryDate = updatedFields.expiryDate;
    } else if (updatedFields.expiryDate instanceof Date) {
      validExpiryDate = Timestamp.fromDate(updatedFields.expiryDate);
    } else if (typeof updatedFields.expiryDate === "string" && !isNaN(Date.parse(updatedFields.expiryDate))) {
      validExpiryDate = Timestamp.fromDate(new Date(updatedFields.expiryDate));
    }
  }
  await updateDoc(taskDoc, {
    ...updatedFields,
    expiryDate: validExpiryDate || null,
  });
};



export const getTasks = async () => {
  const snapshot = await getDocs(tasksCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteTask = async (id) => {
  try {
    if (!id) throw new Error("Invalid task ID");
    console.log("Deleting", id);
    await deleteDoc(doc(db, "tasks", id));
    console.log("Task deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

