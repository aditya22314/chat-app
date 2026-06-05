import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  const { loginWithGoogle, isGoogleLoggingIn } = useAuthStore();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              loginWithGoogle(credentialResponse.credential);
            }
          }}
          onError={() => {
            toast.error("Google sign-in failed");
          }}
          theme="outline"
          size="large"
          width="384"
          text="continue_with"
          shape="rectangular"
        />
      </div>
      {isGoogleLoggingIn && (
        <p className="text-sm text-base-content/60">
          Signing in with Google...
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
