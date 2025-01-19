import React, { createContext, useState, useContext, useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { loginUser, logout as logoutAction ,selectUser} from "../store/slice/userSlice";
import apiService from "../service/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser)

  const [loading, setLoading] = useState(true);

  const login = async (token) => {
    try {
      const resultAction = await dispatch(loginUser(token));
      if (loginUser.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(resultAction.error?.message || "Login failed");
      }
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    apiService.auth.logout();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      apiService.auth
        .verifyToken()
        .then((response) => {
          const userData = response.data || response;
          dispatch(
            loginUser.fulfilled({
              user: userData.user || userData,
              token: token
            })
          );

          console.log(userData,'this is the userData')
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
