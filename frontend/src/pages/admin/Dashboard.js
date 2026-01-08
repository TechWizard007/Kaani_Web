import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiBook, FiFileText, FiUsers, FiBarChart2, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    modules: 0,
    quizzes: 0,
    users: 0,
  });
  const [recentModules, setRecentModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentModules();
  }, []);

  const fetchStats = async () => {
    try {
      const [modulesRes, quizzesRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/modules`),
        axios.get(`${API_URL}/quizzes`),
        axios.get(`${API_URL}/users`),
      ]);

      setStats({
        modules: modulesRes.data.length,
        quizzes: quizzesRes.data.length,
        users: usersRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/modules`);
      setRecentModules(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent modules:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-green-light to-green-lighter">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-dark mb-2">Admin Dashboard</h1>
          <p className="text-gray-700">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Modules</p>
                <p className="text-3xl font-bold text-green-dark">{stats.modules}</p>
              </div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiBook className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold text-green-dark">{stats.quizzes}</p>
              </div>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <FiFileText className="w-8 h-8 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-green-dark">{stats.users}</p>
              </div>
              <div className="w-16 h-16 bg-aqua-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-8 h-8 text-aqua-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-green-dark mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/modules/upload"
                className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <FiPlus className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-green-dark">Upload New Module</span>
              </Link>
              <Link
                to="/admin/quizzes/create"
                className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <FiPlus className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-green-dark">Create New Quiz</span>
              </Link>
              <Link
                to="/admin/modules"
                className="flex items-center gap-3 p-4 bg-aqua-50 rounded-lg hover:bg-aqua-100 transition-colors"
              >
                <FiEdit className="w-5 h-5 text-aqua-600" />
                <span className="font-semibold text-green-dark">Manage Modules</span>
              </Link>
              <Link
                to="/admin/quizzes"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FiEdit className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-dark">Manage Quizzes</span>
              </Link>
            </div>
          </div>

          {/* Recent Modules */}
          <div className="card">
            <h2 className="text-2xl font-bold text-green-dark mb-4">Recent Modules</h2>
            {recentModules.length === 0 ? (
              <p className="text-gray-600">No modules yet. Create your first module!</p>
            ) : (
              <div className="space-y-3">
                {recentModules.map((module) => (
                  <Link
                    key={module._id}
                    to={`/modules/${module._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-semibold text-green-dark">{module.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(module.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

