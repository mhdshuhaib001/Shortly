import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await login(tokenResponse.access_token);
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: () => {
      console.error("Login Failed");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to URL Shortly
          </h2>
        </div>
        <button
          onClick={() => handleGoogleLogin()}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
