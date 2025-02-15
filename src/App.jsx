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
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  return (
    <Provider store={store}>
      <div className="h-screen flex flex-col bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <header className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
          <h1 className="text-xl font-bold tracking-wide">Task Board</h1>
          <Profile />
        </header>
        <main className="flex flex-grow p-6">
          {isAuthenticated ? <TaskBoard /> : <AuthButtons />}
        </main>
      </div>
    </Provider>
  );
}

export default App;
