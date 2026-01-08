import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo (2).png"
              alt="KaAni Web logo"
              className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-bold text-green-dark">KaAni Web</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'text-green-dark font-semibold'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/modules"
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                isActive('/modules')
                  ? 'text-green-dark font-semibold'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Learning Hub
            </Link>
            
            {user && isAdmin() && (
              <Link
                to="/admin"
                className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-green-dark font-semibold'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <FiSettings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{user.name}</span>
                  {isAdmin() && (
                    <span className="hidden sm:inline px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

