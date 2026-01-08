import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiDownload, FiArrowLeft, FiFileText, FiVideo, FiBook, FiPlay } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModule();
    fetchQuizzes();
  }, [id]);

  const fetchModule = async () => {
    try {
      const response = await axios.get(`${API_URL}/modules/${id}`);
      setModule(response.data);
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quizzes/module/${id}`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Module not found</p>
          <Link to="/modules" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (module.contentType === 'video' && module.fileUrl) {
      return (
        <div className="mb-8">
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            src={`http://localhost:5000${module.fileUrl}`}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (module.contentType === 'pdf' && module.fileUrl) {
      return (
        <div className="mb-8">
          <iframe
            src={`http://localhost:5000${module.fileUrl}`}
            className="w-full h-96 rounded-lg shadow-lg"
            title={module.title}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-green-light to-green-lighter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/modules')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Modules
        </button>

        {/* Module Content */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-green-dark mb-4">
                {module.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Created by: {module.createdBy?.name || 'Admin'}</span>
                <span>•</span>
                <span>{new Date(module.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {module.fileUrl && (
              <a
                href={`http://localhost:5000${module.fileUrl}`}
                download
                className="btn-secondary flex items-center gap-2"
              >
                <FiDownload className="w-5 h-5" />
                Download
              </a>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {module.description}
            </p>
          </div>

          {renderContent()}
        </div>

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-green-dark mb-6 flex items-center gap-3">
              <FiBook className="w-6 h-6" />
              Related Quizzes
            </h2>
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-dark mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link
                      to={`/quiz/${module._id}?quizId=${quiz._id}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Take Quiz
                      <FiPlay className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;

