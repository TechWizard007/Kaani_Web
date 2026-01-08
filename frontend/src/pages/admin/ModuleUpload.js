import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiFileText, FiVideo, FiBook, FiX } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminModuleUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'text',
  });
  const [file, setFile] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/modules`);
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-detect content type
      if (selectedFile.type === 'application/pdf') {
        setFormData({ ...formData, contentType: 'pdf' });
      } else if (selectedFile.type.startsWith('video/')) {
        setFormData({ ...formData, contentType: 'video' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('contentType', formData.contentType);
      if (file) {
        data.append('file', file);
      }

      await axios.post(`${API_URL}/modules`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/admin/modules');
    } catch (error) {
      console.error('Error uploading module:', error);
      setError(error.response?.data?.message || 'Error uploading module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-green-light to-green-lighter">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-dark mb-2">Upload Module</h1>
          <p className="text-gray-700">Create a new learning module with PDF, video, or text content</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Introduction to Sustainable Fishing"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                placeholder="Provide a detailed description of the module content..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="text">Text Only</option>
                <option value="pdf">PDF Document</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (Optional for text-only modules)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  {file ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-primary-600">
                        {formData.contentType === 'pdf' && <FiFileText className="w-6 h-6" />}
                        {formData.contentType === 'video' && <FiVideo className="w-6 h-6" />}
                        {formData.contentType === 'text' && <FiBook className="w-6 h-6" />}
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.mp4,.mov,.avi"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF or Video files up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/modules')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Uploading...' : 'Upload Module'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminModuleUpload;

