import React, { createContext, useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout as logoutAction, selectUser, selectToken } from "../store/slice/userSlice";
import apiService from "../service/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(true);

  const login = async (googleToken) => {
    try {
      const resultAction = await dispatch(loginUser(googleToken));
      if (loginUser.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.error?.message || "Login failed");
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    apiService.auth.logout();
    navigate("/");
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await apiService.auth.verifyToken();
          dispatch(
            loginUser.fulfilled({
              user: response,
              token: storedToken
            })
          );
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  const isAuthenticated = !!(user?.id && token);

  return (
    <AuthContext.Provider 
      value={{ 
        login, 
        logout, 
        loading,
        isAuthenticated,
        user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};