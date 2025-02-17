import { ToastContainer } from "react-toastify";
import AuthButtons from "./components/AuthButton";
import TaskBoard from "./components/TaskBoard";
import { Provider } from "react-redux";
import { store } from "./store/tasks";
import Profile from "./components/Profile";
import useAuth from "./hooks/useAuth.js"; 

function App() {
  const { isAuthenticated, isLoading } = useAuth(); 

  if (isLoading) {
    return <p className="mt-10 text-lg text-center">Loading...</p>;
  }

  return (
    <Provider store={store}>
      <div className="flex flex-col h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <header className="flex items-center justify-between px-6 py-4 text-white bg-blue-600 shadow-md">
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
