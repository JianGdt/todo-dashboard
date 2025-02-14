import { db } from "../firebase/config.js";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

const tasksCollectionRef = collection(db, "tasks");

export const addTask = async (task) => {
  try {
    const docRef = await addDoc(tasksCollectionRef, {
      ...task,
      expiryDate: task.expiryDate ? new Date(task.expiryDate) : null,
      updates: [{ action: "Task Created", timestamp: new Date().toISOString() }],
    });
    console.log("Task added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const fetchTasks = async () => {
  try {
    const snapshot = await getDocs(collection(db, "tasks"));
    const taskSet = new Set(); // Track unique IDs

    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      let taskId = doc.id;

      if (taskSet.has(taskId)) {
        console.warn(`Duplicate ID found: ${taskId}, generating a new one.`);
        taskId = taskId + "_" + Math.random().toString(36).substr(2, 5);
      }
      taskSet.add(taskId);

      return {
        id: taskId,
        ...data,
        expiryDate: data.expiryDate && data.expiryDate.seconds
          ? new Date(data.expiryDate.seconds * 1000).toISOString()
          : null,
      };
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Promise.reject("Failed to load tasks");
  }
};



export const updateTask = async (taskId, updatedFields) => {
  const taskDoc = doc(db, "tasks", taskId);
  const taskSnapshot = await getDoc(taskDoc);

  if (!taskSnapshot.exists()) return;

  const taskData = taskSnapshot.data();
  const updates = [...(taskData.updates || [])];

  if (updatedFields.expiryDate && new Date(updatedFields.expiryDate).toISOString() !== taskData.expiryDate?.toDate()?.toISOString()) {
    updates.push({ action: `Expiry date changed to ${new Date(updatedFields.expiryDate).toDateString()}`, timestamp: new Date().toISOString() });
  }

  await updateDoc(taskDoc, {
    ...updatedFields,
   expiryDate: updatedFields.expiryDate 
  ? new Date(updatedFields.expiryDate).toISOString() 
  : null,
    updates,
  });
};


export const getTasks = async () => {
  const snapshot = await getDocs(tasksCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteTask = async (id) => {
  try {
    await deleteDoc(doc(db, "tasks", id));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
