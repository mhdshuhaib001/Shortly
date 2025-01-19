import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slice/userSlice";

const Navbar = () => {
  const { logout } = useAuth();

  const user = useSelector(selectUser)


  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Shortly
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Create URL
                </Link>
                <Link
                  to="/overall"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Analytics
                </Link>
              </div>
            )}
          </div>
          {user && (
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={user.picture}
                alt={user.name}
              />
              <button
                onClick={logout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
