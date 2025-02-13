import { ToastContainer } from "react-toastify";
import AuthButtons from "./components/AuthButton";
import TaskBoard from "./components/TaskBoard";
import { Provider } from "react-redux";
import { store } from "./store/tasks";

function App() {
  return (
    <Provider store={store}>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1>To-Do Board</h1>
      <AuthButtons />
      <TaskBoard />
    </Provider>
  );
}

export default App;
