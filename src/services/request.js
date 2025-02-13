import { db } from "../firebase/config.js";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, onSnapshot } from "firebase/firestore";
import { setLoading, setTasks } from "../store/tasks.js";

const tasksCollectionRef = collection(db, "tasks");

export const addTask = async (task) => {
  try {
    const docRef = await addDoc(tasksCollectionRef, {
      ...task,
      expiryDate: task.expiryDate ? new Date(task.expiryDate) : null, 
      updates: [
        {
          action: "Task Created",
          timestamp: new Date().toISOString(),
        },
      ],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const fetchTasks = () => (dispatch) => {
  dispatch(setLoading(true));
  const tasksCollectionRef = collection(db, "tasks");
  onSnapshot(tasksCollectionRef, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      expiryDate: doc.data().expiryDate?.toDate
        ? doc.data().expiryDate.toDate().toISOString().split("T")[0]
        : "No Expiry",
    }));
    dispatch(setTasks(tasks)); 
    dispatch(setLoading(false));
  });
};


export const updateTask = async (taskId, updatedFields) => {
  const taskDoc = doc(db, "tasks", taskId);
  const taskSnapshot = await getDoc(taskDoc);

  if (!taskSnapshot.exists()) return;

  const taskData = taskSnapshot.data();
  const updates = [...(taskData.updates || [])]; 
  if (updatedFields.title && updatedFields.title !== taskData.title) {
    updates.push({ action: `Title changed to "${updatedFields.title}"`, timestamp: new Date().toISOString() });
  }
  if (updatedFields.description && updatedFields.description !== taskData.description) {
    updates.push({ action: "Description updated", timestamp: new Date().toISOString() });
  }
  if (updatedFields.expiryDate && new Date(updatedFields.expiryDate).toISOString() !== taskData.expiryDate?.toDate().toISOString()) {
    updates.push({ action: `Expiry date changed to ${new Date(updatedFields.expiryDate).toDateString()}`, timestamp: new Date().toISOString() });
  }
  if (updatedFields.category && updatedFields.category !== taskData.category) {
    updates.push({ action: `Moved to ${updatedFields.updates.action}`, timestamp: new Date().toISOString() });
  }
  await updateDoc(taskDoc, {
    ...updatedFields,
    updates, 
  });
};




export const getTasks = async () => {
  const snapshot = await getDocs(tasksCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};
