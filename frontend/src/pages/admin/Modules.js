import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiFileText, FiVideo, FiBook } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminModules = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/modules`);
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this module?')) {
      return;
    }

    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/modules/${id}`);
      setModules(modules.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Error deleting module. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FiFileText className="w-5 h-5" />;
      case 'video':
        return <FiVideo className="w-5 h-5" />;
      default:
        return <FiBook className="w-5 h-5" />;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-dark mb-2">Manage Modules</h1>
            <p className="text-gray-700">Create, edit, and delete learning modules</p>
          </div>
          <Link
            to="/admin/modules/upload"
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Upload Module
          </Link>
        </div>

        {modules.length === 0 ? (
          <div className="card text-center py-12">
            <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No modules yet.</p>
            <Link to="/admin/modules/upload" className="btn-primary inline-flex">
              <FiPlus className="w-5 h-5" />
              Create First Module
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modules.map((module) => (
                    <tr key={module._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-green-dark">
                            {module.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {module.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getContentTypeIcon(module.contentType)}
                          <span className="text-sm text-gray-700 capitalize">
                            {module.contentType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(module.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/modules/${module._id}`}
                            className="text-primary-600 hover:text-primary-700"
                            title="View"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(module._id)}
                            disabled={deleting === module._id}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === module._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <FiTrash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModules;

