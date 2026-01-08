import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheck, FiX, FiArrowLeft, FiAward } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Quiz = () => {
  const { moduleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quizId = searchParams.get('quizId');

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${API_URL}/quizzes/${quizId}/submit`, {
        answers,
      });
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Quiz not found</p>
          <Link to="/modules" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-green-light to-green-lighter">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => navigate(`/modules/${moduleId}`)}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Module
        </button>

        {!submitted ? (
          <div className="card">
            <h1 className="text-3xl font-bold text-green-dark mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-6">
              Answer all questions below. You can review your answers before submitting.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                  <div key={question._id || index} className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-dark mb-4">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.choices.map((choice, choiceIndex) => (
                        <label
                          key={choiceIndex}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            answers[question._id] === choice
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question._id}
                            value={choice}
                            checked={answers[question._id] === choice}
                            onChange={() => handleAnswerChange(question._id, choice)}
                            className="mr-3 w-4 h-4 text-primary-600"
                          />
                          <span className="text-gray-700">{choice}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={Object.keys(answers).length !== quiz.questions.length}
                >
                  Submit Quiz
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-dark mb-2">Quiz Results</h2>
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {results.score}%
              </div>
              <p className="text-gray-600">
                You got {results.correct} out of {results.total} questions correct
              </p>
            </div>

            <div className="space-y-4">
              {results.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {result.isCorrect ? (
                      <FiCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiX className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">{result.question}</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Your answer:</span>{' '}
                          <span className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {result.userAnswer || 'Not answered'}
                          </span>
                        </p>
                        {!result.isCorrect && (
                          <p>
                            <span className="font-medium">Correct answer:</span>{' '}
                            <span className="text-green-700">{result.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setResults(null);
                }}
                className="btn-secondary"
              >
                Retake Quiz
              </button>
              <Link to={`/modules/${moduleId}`} className="btn-primary">
                Back to Module
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

