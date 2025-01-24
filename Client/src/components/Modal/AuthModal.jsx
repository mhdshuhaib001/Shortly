import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export default function AuthModal({ closeModal }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await login(tokenResponse.access_token);
        navigate("/dashboard");

        closeModal();
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: () => {
      console.error("Login Failed");
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Emoji hands */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl">👋</span>
            <span className="text-4xl">🙌</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shortly the url Shortner
            </h2>
            <p className="text-gray-600">
              Login/Signup with just 1 click below
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            className="flex items-center justify-center gap-3 w-full bg-black text-white rounded-full px-6 py-3 hover:bg-gray-800 transition-colors"
            onClick={handleGoogleLogin}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            ENTER WITH GOOGLE
          </button>

          {/* Terms text */}
          <p className="text-sm text-gray-500 max-w-sm">
            By creating an account you agree with our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            ,{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
