import { useAuth0 } from "@auth0/auth0-react";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
      authorizationParams: {
        screen_hint: "signup",
        prompt: "login", 
      },
    });
  };

  return <button onClick={handleSignUp} className="px-4 border border-black rounded-md">Sign Up</button>

};