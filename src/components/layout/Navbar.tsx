
// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar on login/register pages
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200">
              Project Manager
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
            
            <Link
              to="/projects/create"
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              New Project
            </Link>

            {/* User Info */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-500">
              <span className="text-sm">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;