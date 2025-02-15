import { useAuth0 } from "@auth0/auth0-react";
import AuthButtons from "./AuthButton";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (
            <div className="flex gap-4 items-center justify-around p-4 bg-gray-100">
                <div className="flex items-center gap-2">
                    <img src={user.picture} alt={user.name} width={20} height={20} className="rounded-full" />
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
                <AuthButtons />
            </div>
        )
    );
};

export default Profile;