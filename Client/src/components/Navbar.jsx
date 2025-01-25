import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slice/userSlice";
import AuthModal from "./Modal/AuthModal";

const Navbar = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector(selectUser);
  const token = localStorage.getItem("token");

  const handleLogin = () => {
    setIsModalOpen(true);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-teal-600">
              Shortly
            </Link>
          </div>

          {/* HamBurger Icon  */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-teal-600 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex space-x-8">
            {user && !!token ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
                  >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
                  >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
                  >
                  Create URL
                </Link>
                <Link
                  to="/overall"
                  className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
                  >
                  Analytics
                </Link>
              </>
            ) : null}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && token ? (
              <>
                <img
                  className="h-8 w-8 rounded-full border-2 border-teal-600"
                  src={user.picture}
                  alt={`${user.name}'s profile`}
                  title={user.name}
                />
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600  rounded-lg hover:bg-teal-700 focus:ring-2  focus:ring-teal-500  focus:ring-offset-2"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4 bg-white shadow-lg ">
          {user && token ? ( 
            <>
              <Link
                to="/"
                className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
              >
                Create URL
              </Link>
              <Link
                to="/overall"
                className="text-gray-700 hover:text-teal-600 font-medium transition duration-300 ease-in-out"
              >
                Analytics
              </Link>
            </>
          ) : null}
        </div>
      )}

      {isModalOpen && <AuthModal closeModal={() => setIsModalOpen(false)} />}
    </nav>
  );
};

export default Navbar;
