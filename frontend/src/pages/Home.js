import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiArrowRight, FiLeaf, FiScale } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="block">Empowering Agriculture &</span>
            <span className="block text-6xl md:text-7xl mt-2 drop-shadow-2xl">Fisheries</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95">
            Simplifying laws, sharing practical guides, and connecting communities to maximize harvests and sustainable practices.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/modules" className="btn-primary text-lg">
              Start Learning
              <FiArrowRight className="inline" />
            </Link>
            <a href="/sustainability.html" className="btn-secondary text-lg">
              Explore More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-green-light to-green-lighter">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-dark text-center mb-4">
            Comprehensive Platform Features
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Everything you need to succeed in modern agriculture and fisheries, all in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-dark mb-3">Learning Hub</h3>
              <p className="text-gray-700 mb-6">
                Organized modules, tutorials, and interactive quizzes for farmers, fishers, and students.
              </p>
              <Link to="/modules" className="btn-secondary inline-flex">
                Explore <FiArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLeaf className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-dark mb-3">Sustainability</h3>
              <p className="text-gray-700 mb-6">
                Eco-friendly innovations, success stories, and modern agricultural solutions.
              </p>
              <a href="/sustainability.html" className="btn-secondary inline-flex">
                Explore <FiArrowRight className="ml-2" />
              </a>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiScale className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-dark mb-3">Legal Guide</h3>
              <p className="text-gray-700 mb-6">
                Simplified legal guidance, permits, regulations, and compliance checklists.
              </p>
              <a href="/legal.html" className="btn-secondary inline-flex">
                Explore <FiArrowRight className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

