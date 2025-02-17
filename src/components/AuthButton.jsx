import useAuth from "../hooks/useAuth"; 
import { FaUserCircle } from "react-icons/fa";
import { SignupButton } from "./Buttons/SignUpPage";
import { LoginButton } from "./Buttons/LoginPage";


const AuthButtons = () => {
  const {  logout, isAuthenticated,  } = useAuth();

  return (
    <div className="flex flex-col items-center m-auto text-center">
      {!isAuthenticated && <FaUserCircle className="mb-4 text-6xl text-gray-400" />}
      {!isAuthenticated && (
        <p className="mb-4 text-gray-600">
          Please log in or sign up to access your task dashboard.
        </p>
      )}
      {!isAuthenticated ? (
        <div className="flex gap-6">
        <LoginButton/>
        <SignupButton/>
        </div>
      ) : (
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="w-full px-6 py-3 text-lg font-medium text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
