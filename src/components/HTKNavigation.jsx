import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Users, Hammer } from 'lucide-react'; // Added Hammer icon for trades

function HTKNavigation() {
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [isTradeMenuOpen, setIsTradeMenuOpen] = useState(false);

  const toggleCustomerMenu = () => {
    setIsCustomerMenuOpen(!isCustomerMenuOpen);
    setIsTradeMenuOpen(false); // Close other menu if open
  };

  const toggleTradeMenu = () => {
    setIsTradeMenuOpen(!isTradeMenuOpen);
    setIsCustomerMenuOpen(false); // Close other menu if open
  };

  return (
    <nav className="htk-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/branding/HTK-logo.png" // Changed to SVG for better quality
                alt="HandyToKnow - Connecting Local Trades" 
                className="htk-logo h-12 w-auto"
              />
              <span className="text-xl font-bold htk-gold-text hidden sm:block">
                HandyToKnow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/how-it-works" className="htk-nav-link">How It Works</Link>
            <Link to="/community" className="htk-nav-link">Community</Link>
            <Link to="/admin" className="htk-nav-link">Admin</Link>
            <Link to="/customer-signup" className="htk-button-primary">Find Premium Tradespeople</Link>
            <Link to="/trade-signup" className="htk-button-secondary">Join as Professional Trade</Link>
          </div>

          {/* Mobile Hamburger Menus */}
          <div className="-mr-2 flex md:hidden items-center space-x-2">
            {/* Customer Menu Toggle */}
            <button
              onClick={toggleCustomerMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-htk-platinum hover:text-htk-gold hover:bg-htk-charcoal focus:outline-none focus:ring-2 focus:ring-inset focus:ring-htk-gold transition-all duration-300"
              aria-controls="customer-mobile-menu"
              aria-expanded={isCustomerMenuOpen}
            >
              <span className="sr-only">Open customer menu</span>
              {isCustomerMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Users className="block h-6 w-6" aria-hidden="true" /> // Customer icon
              )}
            </button>

            {/* Trade Menu Toggle */}
            <button
              onClick={toggleTradeMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-htk-platinum hover:text-htk-gold hover:bg-htk-charcoal focus:outline-none focus:ring-2 focus:ring-inset focus:ring-htk-gold transition-all duration-300"
              aria-controls="trade-mobile-menu"
              aria-expanded={isTradeMenuOpen}
            >
              <span className="sr-only">Open trade menu</span>
              {isTradeMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Hammer className="block h-6 w-6" aria-hidden="true" /> // Trade icon
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Mobile Menu */}
      {isCustomerMenuOpen && (
        <div className="md:hidden mobile-menu-dropdown" id="customer-mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/how-it-works" className="htk-mobile-nav-link">How It Works (Customer)</Link>
            <Link to="/customer-signup" className="htk-mobile-nav-link">Find Premium Tradespeople</Link>
            <Link to="/pricing" className="htk-mobile-nav-link">Pricing/Credits</Link>
            <Link to="/trades" className="htk-mobile-nav-link">Trade Directory</Link>
            <Link to="/post" className="htk-mobile-nav-link">Post a Job</Link>
            <Link to="/dashboard/customer" className="htk-mobile-nav-link">Customer Dashboard</Link>
            <Link to="/contact" className="htk-mobile-nav-link">Contact</Link>
          </div>
        </div>
      )}

      {/* Trade Mobile Menu */}
      {isTradeMenuOpen && (
        <div className="md:hidden mobile-menu-dropdown" id="trade-mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/how-it-works" className="htk-mobile-nav-link">How It Works (Trade)</Link>
            <Link to="/trade-signup" className="htk-mobile-nav-link">Join as Professional Trade</Link>
            <Link to="/pricing" className="htk-mobile-nav-link">Pricing/Credits</Link>
            <Link to="/dashboard/trade" className="htk-mobile-nav-link">Trade Dashboard</Link>
            <Link to="/community" className="htk-mobile-nav-link">Community</Link>
            <Link to="/admin" className="htk-mobile-nav-link">Admin</Link>
            <Link to="/contact" className="htk-mobile-nav-link">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default HTKNavigation;

