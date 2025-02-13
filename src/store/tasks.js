import { configureStore, createSlice } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/request.js";

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
});

export const { setTasks, addNewTask, updateTaskState, deleteTaskState, setLoading, setError } = tasksSlice.actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const tasks = await fetchTasks();
    dispatch(setTasks(tasks));
  } catch (error) {
    dispatch(setError("Failed to load tasks", { error }));
  }
};

export const createTask = (task) => async (dispatch) => {
  try {
    const taskId = await addTask(task);
    dispatch(addNewTask({ id: taskId, ...task }));
  } catch (error) {
    dispatch(setError("Failed to add task", { error }));
  }
};

export const editTask = (taskId, updatedFields) => async (dispatch, getState) => {
    try {
      const currentTask = getState().tasks.tasks.find(task => task.id === taskId);
      if (!currentTask) return;
      const updatedTask = {
        ...currentTask,
        ...updatedFields,
        updates: [
          ...(currentTask.updates || []),
          {
            action: `Task updated`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      dispatch(updateTaskState(updatedTask));
      await updateTask(taskId, updatedFields);
    } catch (error) {
      dispatch(setError("Failed to update task", { error }));
    }
  };
  
  

export const removeTask = (taskId) => async (dispatch) => {
  try {
    await deleteTask(taskId);
    dispatch(deleteTaskState(taskId));
  } catch (error) {
    dispatch(setError("Failed to delete task", { error}));
  }
};

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
  },
});
