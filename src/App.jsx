import { ToastContainer } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButtons from "./components/AuthButton";
import TaskBoard from "./components/TaskBoard";
import { Provider } from "react-redux";
import { store } from "./store/tasks";
import Profile from "./components/Profile";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Profile/>
      {isAuthenticated ? <TaskBoard /> : <AuthButtons />}
    </Provider>
  );
}

export default App;
