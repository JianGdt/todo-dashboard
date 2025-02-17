import { useAuth0 } from "@auth0/auth0-react";

const useAuth = () => {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    const signUp = () => {
        loginWithRedirect({
            screen_hint: "signup",
        });
    };

    return { loginWithRedirect, logout, user, isAuthenticated, isLoading, signUp };
};

export default useAuth;
