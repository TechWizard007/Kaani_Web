import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-light to-green-lighter py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-green-dark">KaAni Web</span>
            </div>
            <p className="text-gray-700 max-w-md">
              Empowering agriculture and fisheries through accessible education, legal guidance, and sustainable innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-green-dark mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/modules" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Learning Hub
                </Link>
              </li>
              <li>
                <a href="/sustainability.html" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="/legal.html" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Legal Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-green-dark mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-green-dark/15 pt-6">
          <p className="text-center text-gray-700">
            © 2024 KaAni Web. All rights reserved. Empowering sustainable agriculture and fisheries.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

