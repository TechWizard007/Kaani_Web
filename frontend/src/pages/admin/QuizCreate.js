import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminQuizCreate = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    moduleId: '',
    title: '',
    questions: [
      {
        question: '',
        choices: ['', '', '', ''],
        correctAnswer: '',
      },
    ],
  });
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

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          choices: ['', '', '', ''],
          correctAnswer: '',
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.moduleId || !formData.title) {
      setError('Module and title are required');
      setLoading(false);
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question || !q.correctAnswer) {
        setError(`Question ${i + 1} is incomplete`);
        setLoading(false);
        return;
      }
      const validChoices = q.choices.filter((c) => c.trim() !== '');
      if (validChoices.length < 2) {
        setError(`Question ${i + 1} needs at least 2 choices`);
        setLoading(false);
        return;
      }
      if (!validChoices.includes(q.correctAnswer)) {
        setError(`Question ${i + 1}: Correct answer must be one of the choices`);
        setLoading(false);
        return;
      }
    }

    try {
      const quizData = {
        ...formData,
        questions: formData.questions.map((q) => ({
          question: q.question,
          choices: q.choices.filter((c) => c.trim() !== ''),
          correctAnswer: q.correctAnswer,
        })),
      };

      await axios.post(`${API_URL}/quizzes`, quizData);
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.response?.data?.message || 'Error creating quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-green-light to-green-lighter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-dark mb-2">Create Quiz</h1>
          <p className="text-gray-700">Build a new quiz with multiple choice questions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="card space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Module *
              </label>
              <select
                name="moduleId"
                value={formData.moduleId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a module...</option>
                {modules.map((module) => (
                  <option key={module._id} value={module._id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Module 1 Assessment Quiz"
                required
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-dark">
                    Question {qIndex + 1}
                  </h3>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="input-field min-h-[80px]"
                      placeholder="Enter your question here..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choices *
                    </label>
                    <div className="space-y-2">
                      {question.choices.map((choice, cIndex) => (
                        <div key={cIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === choice}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', choice)}
                            className="w-4 h-4 text-primary-600"
                            disabled={!choice.trim()}
                          />
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                            className="input-field flex-1"
                            placeholder={`Choice ${cIndex + 1}`}
                            required={cIndex < 2}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors text-gray-600 hover:text-primary-600 flex items-center justify-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Another Question
            </button>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/quizzes')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : (
                <>
                  <FiSave className="w-5 h-5" />
                  Create Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQuizCreate;

