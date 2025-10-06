import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HTKNavigation from './components/HTKNavigation';
import HTKFooter from './components/HTKFooter';
import EnhancedHomePage from './components/EnhancedHomePage';
import CustomerSignup from './components/CustomerSignup';
import TradeSignup from './components/TradeSignup';
import PricingPage from './components/PricingPage';
import TradesPage from './components/TradesPage';
import PostJobPage from './components/PostJobPage';
import CustomerAuth from './components/CustomerAuth';
import AdminDashboard from './components/AdminDashboard';
import SuccessPage from './components/SuccessPage';
import JobSearchPage from './components/JobSearchPage';
import ComingSoon from './components/ComingSoon';
import NotFoundPage from './components/NotFoundPage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import './styles/branding.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen htk-bg-primary">
        <HTKNavigation />
        <main>
          <Routes>
            <Route path="/" element={<EnhancedHomePage />} />
            <Route path="/customer-signup" element={<CustomerSignup />} />
            <Route path="/trade-signup" element={<TradeSignup />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/trades" element={<TradesPage />} />
            <Route path="/post" element={<PostJobPage />} />
            <Route path="/login" element={<CustomerAuth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/jobs" element={<JobSearchPage />} />
            <Route path="/how-it-works" element={<ComingSoon title="How It Works" />} />
            <Route path="/community" element={<ComingSoon title="Community" />} />
            <Route path="/dashboard/customer" element={<ComingSoon title="Customer Dashboard" />} />
            <Route path="/dashboard/trade" element={<ComingSoon title="Trade Dashboard" />} />
            <Route path="/contact" element={<ComingSoon title="Contact & Support" />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <HTKFooter />
      </div>
    </Router>
  );
}

export default App;
