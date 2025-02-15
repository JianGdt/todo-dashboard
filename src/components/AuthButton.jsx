import { useAuth0 } from "@auth0/auth0-react";
import { FaUserCircle } from "react-icons/fa";

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div className="flex m-auto flex-col items-center text-center">
      {!isAuthenticated && <FaUserCircle className="text-gray-400 text-6xl mb-4" />}
      {!isAuthenticated && (
        <p className="text-gray-600 mb-4">
          Please log in to access your task management dashboard.
        </p>
      )}
      <button
        onClick={() =>
          isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()
        }
        className={`w-full px-6 py-3 text-lg font-medium text-white rounded-lg shadow-md transition-all ${
          isAuthenticated ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isAuthenticated ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default AuthButtons;
