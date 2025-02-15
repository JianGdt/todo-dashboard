import { useAuth0 } from "@auth0/auth0-react";
import AuthButtons from "./AuthButton";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex items-center justify-center gap-4 bg-white px-4 py-2 rounded-lg shadow-md border">
        <img 
          src={user.picture} 
          alt={user.name} 
          width={40} 
          height={40} 
          className="rounded-full border border-gray-300" 
        />
        <div className="text-sm">
          <h2 className="font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <AuthButtons />
      </div>
    )
  );
};

export default Profile;
