
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Users, Star, Clock, Zap, CreditCard, TrendingUp, Download, Search, Filter, Mail, Phone, MapPin, Calendar, PoundSterling, Menu, X } from 'lucide-react'
import './App.css'
// import './mobile-optimizations.css'
import './styles/branding.css'

// Import your page components here
import CustomerSignup from './components/CustomerSignup';
import TradeSignup from './components/TradeSignup';
import AdminDashboard from './components/AdminDashboard';
import HowItWorksPage from './components/HowItWorksPage';
import AskATradePage from './components/AskATradePage';
import CostGuidesPage from './components/CostGuidesPage';
import PricingPage from './components/PricingPage';
import TradesPage from './components/TradesPage';
import PostJobPage from './components/PostJobPage';
import CompetitionsPage from './components/CompetitionsPage';
import LeaderboardsPage from './components/LeaderboardsPage';
import CommunityPage from './components/CommunityPage';
import ContactPage from './components/ContactPage';
import SuccessPage from './components/SuccessPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CustomerDashboard from './components/CustomerDashboard';
import TradeDashboard from './components/TradeDashboard';
import SponsorsPage from './components/SponsorsPage';
import ReviewsPage from './components/ReviewsPage';
import CollaborationsPage from './components/CollaborationsPage';
import EnhancedHomePage from './components/EnhancedHomePage';
import HTKNavigation from './components/HTKNavigation';
import HTKFooter from './components/HTKFooter';

function App() {
  return (
    <Router>
      <div className="App">
        <HTKNavigation />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<EnhancedHomePage />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route path="/trade-signup" element={<TradeSignup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/ask-a-trade" element={<AskATradePage />} />
          <Route path="/cost-guides" element={<CostGuidesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/trades" element={<TradesPage />} />
          <Route path="/post" element={<PostJobPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/trade" element={<TradeDashboard />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
          </Routes>
        </main>
        <HTKFooter />
      </div>
    </Router>
  )
}

export default App;

