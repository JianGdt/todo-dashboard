import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/request.js";
import { toast } from "react-toastify";

export const loadTasks = createAsyncThunk(
    "tasks/loadTasks",
    async (_, { rejectWithValue }) => {
      try {
        return await fetchTasks();
      } catch (error) {
        return rejectWithValue("Failed to load tasks", {error}); 
      }
    }
  );

export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { rejectWithValue }) => {
    try {
      const newTask = await addTask(taskData);
      if (!newTask.id) {
        throw new Error("Task ID is undefined");
      }
      return newTask;
    } catch (error) {
      console.error("Task creation error:", error);
      return rejectWithValue("Failed to add task");
    }
  });

export const editTask = createAsyncThunk("tasks/editTask", async ({ taskId, updatedFields }, { getState, rejectWithValue }) => {
    try {
      const currentTask = getState().tasks.tasks.find((task) => task.id === taskId);
      if (!currentTask) throw new Error("Task not found");
  
      const updatedTask = {
        ...currentTask,
        ...updatedFields,
        id: String(taskId), 
        expiryDate: updatedFields.expiryDate 
          ? new Date(updatedFields.expiryDate).toISOString() 
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
  expiredTasks: [],
drafts: {},
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
        const { id, category, expiryDate } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
          console.error("Update Task Error: Task not found", id);
          return;
        }
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          category,
          expiryDate,
        };
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
      checkExpiredTasks: (state) => {
        const now = new Date().toISOString();
        state.expiredTasks = state.tasks.filter(task => task.expiryDate && task.expiryDate < now);
        state.expiredTasks.forEach(task => {
          toast.warning(`Task "${task.title}" has expired!`);
        });
      },
      saveDraft: (state, action) => {
        const { taskId, content } = action.payload;
        state.drafts[taskId] = content; 
      },
      clearDraft: (state, action) => {
        delete state.drafts[action.payload];  
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
            const newTask = {
                ...action.payload,
                id: String(action.payload.id), 
            };
            const exists = state.tasks.some((task) => task.id === newTask.id);
            if (!exists) {
                state.tasks.push(newTask);
            } else {
                console.warn(`Task with ID ${newTask.id} already exists, skipping.`);
            }
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
               expiryDate: typeof action.payload.expiryDate === "object" && action.payload.expiryDate.seconds
                ? new Date(action.payload.expiryDate.seconds * 1000).toISOString()
                : action.payload.expiryDate,
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
  
  export const {
    setTasks,
    addNewTask,
    updateTaskState, 
    deleteTaskState,
    setLoading,
    setError,
    checkExpiredTasks,
    saveDraft,
    clearDraft,
  } = tasksSlice.actions;
  
  export const store = configureStore({
    reducer: {
      tasks: tasksSlice.reducer,
    },
  });
