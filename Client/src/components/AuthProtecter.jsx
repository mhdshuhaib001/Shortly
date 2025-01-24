import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthProtect = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    } else {
        setLoading(false);
    }
  }, [token, navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return children;
};

export default AuthProtect;
