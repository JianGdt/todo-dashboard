import { Timestamp } from "firebase/firestore";
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/request.js";

export const loadTasks = createAsyncThunk(
    "tasks/loadTasks",
    async (_, { rejectWithValue }) => {
      try {
        return await fetchTasks();
      } catch (error) {
        return rejectWithValue("Failed to load tasks", {error}); // Ensure it's a plain string
      }
    }
  );
  

export const createTask = createAsyncThunk("tasks/createTask", async (task, { rejectWithValue }) => {
  try {
    const taskId = await addTask(task);
    if (!taskId) throw new Error("Task ID is undefined");

    return {
      id: taskId,
      ...task,
      expiryDate: task.expiryDate
  ? new Date(task.expiryDate).toISOString().split("T")[0] 
  : "",
    };
  } catch (error) {
    return rejectWithValue("Failed to add task",{error});
  }
});

export const editTask = createAsyncThunk("tasks/editTask", async ({ taskId, updatedFields }, { getState, rejectWithValue }) => {
    try {
      const currentTask = getState().tasks.tasks.find((task) => task.id === taskId);
      if (!currentTask) throw new Error("Task not found");
  
      const updatedTask = {
        ...currentTask,
        ...updatedFields,
        expiryDate: updatedFields.expiryDate 
          ? Timestamp.fromDate(new Date(updatedFields.expiryDate)) 
          : currentTask.expiryDate,
        
        updates: [
          ...(currentTask.updates || []),
          { action: "Task updated", timestamp: new Date().toISOString() },
        ],
      };
      await updateTask(taskId, updatedFields);
      return updatedTask;
    } catch (error) {
      console.error("Update Task Error:", error);
      return rejectWithValue("Failed to update task");
    }
  });
  

export const removeTask = createAsyncThunk("tasks/removeTask", async (taskId, { rejectWithValue }) => {
  try {
    await deleteTask(taskId);
    return taskId;
  } catch (error) {
    return rejectWithValue("Failed to delete task", {error});
  }
});

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
      setTasks: (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      },
      addNewTask: (state, action) => {
        state.tasks.push(action.payload);
      },
      updateTaskState: (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...state.tasks[index],
            ...action.payload,
            updates: action.payload.updates || state.tasks[index].updates, 
          };
        }
      },
      deleteTaskState: (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadTasks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loadTasks.fulfilled, (state, action) => {
          state.tasks = action.payload;
          state.loading = false;
        })
        .addCase(loadTasks.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(createTask.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
        })
        .addCase(createTask.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(editTask.fulfilled, (state, action) => {
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            if (index !== -1) {
              state.tasks[index] = {
                ...state.tasks[index],
                ...action.payload,
                expiryDate: action.payload.expiryDate
                  ? new Date(action.payload.expiryDate.seconds * 1000).toISOString()
                  : null,
              };
            }
          })          
        .addCase(editTask.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(removeTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        })
        .addCase(removeTask.rejected, (state, action) => {
          state.error = action.payload;
        });
    },
  });
  
  // ✅ Ensure you export `updateTaskState`
  export const {
    setTasks,
    addNewTask,
    updateTaskState, // 🔹 Now properly defined and exported
    deleteTaskState,
    setLoading,
    setError,
  } = tasksSlice.actions;
  
  export const store = configureStore({
    reducer: {
      tasks: tasksSlice.reducer,
    },
  });
