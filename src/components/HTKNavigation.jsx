
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function HTKNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="htk-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/branding/HTK-logo.png" 
                alt="HandyToKnow - Connecting Local Trades" 
                className="htk-logo h-12 w-auto"
              />
              <span className="text-xl font-bold htk-gold-text hidden sm:block">
                HandyToKnow
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/how-it-works" className="htk-nav-link">How It Works</Link>
            <Link to="/community" className="htk-nav-link">Community</Link>
            <Link to="/admin" className="htk-nav-link">Admin</Link>
            <Link to="/customer-signup" className="htk-button-primary">Find Premium Tradespeople</Link>
            <Link to="/trade-signup" className="htk-button-secondary">Join as Professional Trade</Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-htk-platinum hover:text-htk-gold hover:bg-htk-charcoal focus:outline-none focus:ring-2 focus:ring-inset focus:ring-htk-gold transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/how-it-works" className="htk-mobile-nav-link">How It Works</Link>
            <Link to="/community" className="htk-mobile-nav-link">Community</Link>
            <Link to="/admin" className="htk-mobile-nav-link">Admin</Link>
            <Link to="/customer-signup" className="htk-mobile-nav-link">Find Premium Tradespeople</Link>
            <Link to="/trade-signup" className="htk-mobile-nav-link">Join as Professional Trade</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default HTKNavigation;

