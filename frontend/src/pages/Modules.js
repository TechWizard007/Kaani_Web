import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiBook, FiDownload, FiFileText, FiVideo, FiSearch } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FiFileText className="w-6 h-6" />;
      case 'video':
        return <FiVideo className="w-6 h-6" />;
      default:
        return <FiBook className="w-6 h-6" />;
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-600';
      case 'video':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-primary-100 text-primary-600';
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
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-dark mb-4">
            Learning Hub
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Explore our comprehensive collection of modules covering fisheries, agriculture, and sustainable practices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No modules found matching your search.' : 'No modules available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <div key={module._id} className="card hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getContentTypeColor(module.contentType)}`}>
                    {getContentTypeIcon(module.contentType)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(module.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-green-dark mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {module.description}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/modules/${module._id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
                  >
                    View Details
                    <FiBook className="w-4 h-4" />
                  </Link>
                  {module.fileUrl && (
                    <a
                      href={`http://localhost:5000${module.fileUrl}`}
                      download
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                      title="Download PDF"
                    >
                      <FiDownload className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modules;

