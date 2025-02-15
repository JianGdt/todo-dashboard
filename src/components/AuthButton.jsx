import { useAuth0 } from "@auth0/auth0-react";

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="border border-red-500 text-red-500 text-sm px-4 py-0.5 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="border border-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
