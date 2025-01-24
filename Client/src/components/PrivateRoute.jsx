import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slice/userSlice';

const PrivateRoute = ({ children }) => {
  const {  loading } = useAuth();
  const user = useSelector(selectUser)
  if (loading) return <div>Loading...</div>; 

  if (!user) {
    return <Navigate to="/" />;
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;