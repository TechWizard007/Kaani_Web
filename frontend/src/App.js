import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminModules from './pages/admin/Modules';
import AdminModuleUpload from './pages/admin/ModuleUpload';
import AdminQuizzes from './pages/admin/Quizzes';
import AdminQuizCreate from './pages/admin/QuizCreate';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:id" element={<ModuleDetail />} />
              <Route path="/quiz/:moduleId" element={<Quiz />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/modules"
                element={
                  <PrivateRoute>
                    <AdminModules />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/modules/upload"
                element={
                  <PrivateRoute>
                    <AdminModuleUpload />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/quizzes"
                element={
                  <PrivateRoute>
                    <AdminQuizzes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/quizzes/create"
                element={
                  <PrivateRoute>
                    <AdminQuizCreate />
                  </PrivateRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

