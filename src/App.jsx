import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Star, MapPin, Search, Upload, Play, Trophy, Users, Calendar, Mail, Phone, Globe, Award, Zap, Shield, Clock } from 'lucide-react'
import './App.css'

// HTK Navigation Component
function HTKNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState(null)
  const location = useLocation()

  return (
    <nav className="htk-nav sticky top-0 z-50 border-b border-htk-gold/20 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/branding/HTK-logo.png" alt="HTK" className="h-10 w-auto" />
            <span className="htk-brand-text text-xl font-bold">HandyToKnow</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`htk-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/pricing" className={`htk-nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}>Pricing</Link>
            <Link to="/trades" className={`htk-nav-link ${location.pathname === '/trades' ? 'active' : ''}`}>Find Trades</Link>
            <Link to="/post" className={`htk-nav-link ${location.pathname === '/post' ? 'active' : ''}`}>Post Job</Link>
            <Link to="/competitions" className={`htk-nav-link ${location.pathname === '/competitions' ? 'active' : ''}`}>Competitions</Link>
            <Link to="/leaderboards" className={`htk-nav-link ${location.pathname === '/leaderboards' ? 'active' : ''}`}>Leaderboards</Link>
            <Link to="/community" className={`htk-nav-link ${location.pathname === '/community' ? 'active' : ''}`}>Community</Link>
            <Link to="/contact" className={`htk-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-htk-platinum hover:text-htk-gold">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="htk-button-primary">Join HTK</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={userType === 'trade' ? '/dashboard/trade' : '/dashboard/customer'}>
                  <Button variant="ghost" className="text-htk-platinum hover:text-htk-gold">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsLoggedIn(false)}
                  className="text-htk-platinum hover:text-htk-gold"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// HTK Footer Component
function HTKFooter() {
  return (
    <footer className="htk-bg-secondary border-t border-htk-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/branding/HTK-logo.png" alt="HTK" className="h-8 w-auto" />
              <span className="htk-brand-text text-lg font-bold">HandyToKnow</span>
            </div>
            <p className="text-htk-platinum/80 text-sm">
              Connecting local trades with customers. Built by trades, for trades.
            </p>
          </div>
          
          <div>
            <h4 className="htk-gold-text font-semibold mb-4">Platform</h4>
            <div className="space-y-2">
              <Link to="/pricing" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Pricing</Link>
              <Link to="/trades" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Find Trades</Link>
              <Link to="/post" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Post Job</Link>
            </div>
          </div>
          
          <div>
            <h4 className="htk-gold-text font-semibold mb-4">Community</h4>
            <div className="space-y-2">
              <Link to="/competitions" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Competitions</Link>
              <Link to="/sponsors" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Sponsors</Link>
              <Link to="/community" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Community</Link>
            </div>
          </div>
          
          <div>
            <h4 className="htk-gold-text font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link to="/contact" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Contact Us</Link>
              <a href="#" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Help Center</a>
              <a href="#" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Terms</a>
              <a href="#" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Privacy</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-htk-gold/20 mt-8 pt-8 text-center">
          <p className="text-htk-platinum/60 text-sm">
            © 2024 HandyToKnow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Home Page Component
function HomePage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 htk-animate-fade-in">
            Connecting Local <span className="htk-gold-text">Trades</span>
            <br />with Customers
          </h1>
          <p className="text-xl text-htk-platinum/80 mb-8 max-w-2xl mx-auto htk-animate-fade-in">
            Built by trades, for trades. Credits never expire. Join the community that puts tradespeople first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center htk-animate-fade-in">
            <Link to="/trades">
              <Button size="lg" className="htk-button-primary text-lg px-8 py-4">
                Find a Tradesperson
              </Button>
            </Link>
            <Link to="/signup?type=trade">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-htk-gold text-htk-gold hover:bg-htk-gold hover:text-black">
                Join as Tradesperson
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="htk-animate-scale-in">
              <Users className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <div className="text-3xl font-bold htk-gold-text mb-2">2,500+</div>
              <div className="text-htk-platinum/80">Verified Tradespeople</div>
            </div>
            <div className="htk-animate-scale-in">
              <Zap className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <div className="text-3xl font-bold htk-gold-text mb-2">15,000+</div>
              <div className="text-htk-platinum/80">Jobs Completed</div>
            </div>
            <div className="htk-animate-scale-in">
              <Star className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <div className="text-3xl font-bold htk-gold-text mb-2">4.9/5</div>
              <div className="text-htk-platinum/80">Average Rating</div>
            </div>
            <div className="htk-animate-scale-in">
              <Clock className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <div className="text-3xl font-bold htk-gold-text mb-2">24/7</div>
              <div className="text-htk-platinum/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 htk-bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 htk-gold-text">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center htk-animate-fade-in">
              <div className="w-16 h-16 bg-htk-gold text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-4 htk-platinum-text">Create Account</h3>
              <p className="text-htk-platinum/80">Join as a customer or tradesperson</p>
            </div>
            <div className="text-center htk-animate-fade-in">
              <div className="w-16 h-16 bg-htk-gold text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-4 htk-platinum-text">Find or Post</h3>
              <p className="text-htk-platinum/80">Browse trades or post your job</p>
            </div>
            <div className="text-center htk-animate-fade-in">
              <div className="w-16 h-16 bg-htk-gold text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-4 htk-platinum-text">Connect</h3>
              <p className="text-htk-platinum/80">Work together and build trust</p>
            </div>
          </div>
        </div>
      </section>

      <HTKFooter />
    </div>
  )
}

// Pricing Page Component
function PricingPage() {
  const handlePurchase = async (priceId, amount) => {
    // This will integrate with Stripe
    alert(`Redirecting to Stripe checkout for ${amount} credits...`)
    // TODO: Implement Stripe checkout session
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Credit Packages</h1>
          <p className="text-xl text-htk-platinum/80">Credits never expire. Buy once, use forever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Bronze Package */}
          <Card className="htk-card border-htk-gold/20 hover:border-htk-gold">
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text">Bronze</CardTitle>
              <CardDescription className="text-htk-platinum/80">Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold htk-platinum-text">£15</div>
              <div className="text-htk-gold">5 Credits</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="text-htk-platinum/80">• 5 job lead credits</li>
                <li className="text-htk-platinum/80">• Basic profile features</li>
                <li className="text-htk-platinum/80">• Email support</li>
              </ul>
              <Button 
                className="w-full htk-button-primary"
                onClick={() => handlePurchase('bronze', 5)}
              >
                Buy Credits
              </Button>
            </CardContent>
          </Card>

          {/* Silver Package */}
          <Card className="htk-card border-htk-gold relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="htk-badge-gold">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text">Silver</CardTitle>
              <CardDescription className="text-htk-platinum/80">Best value for regular use</CardDescription>
              <div className="text-3xl font-bold htk-platinum-text">£25</div>
              <div className="text-htk-gold">12 Credits</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="text-htk-platinum/80">• 12 job lead credits</li>
                <li className="text-htk-platinum/80">• Enhanced profile features</li>
                <li className="text-htk-platinum/80">• Priority support</li>
                <li className="text-htk-platinum/80">• Featured in search</li>
              </ul>
              <Button 
                className="w-full htk-button-primary"
                onClick={() => handlePurchase('silver', 12)}
              >
                Buy Credits
              </Button>
            </CardContent>
          </Card>

          {/* Gold Package */}
          <Card className="htk-card border-htk-gold/20 hover:border-htk-gold">
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text">Gold</CardTitle>
              <CardDescription className="text-htk-platinum/80">For power users</CardDescription>
              <div className="text-3xl font-bold htk-platinum-text">£60</div>
              <div className="text-htk-gold">30 Credits</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="text-htk-platinum/80">• 30 job lead credits</li>
                <li className="text-htk-platinum/80">• Premium profile features</li>
                <li className="text-htk-platinum/80">• 24/7 priority support</li>
                <li className="text-htk-platinum/80">• Top search placement</li>
                <li className="text-htk-platinum/80">• Analytics dashboard</li>
              </ul>
              <Button 
                className="w-full htk-button-primary"
                onClick={() => handlePurchase('gold', 30)}
              >
                Buy Credits
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

// Trades Directory Component
function TradesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTrade, setSelectedTrade] = useState('all')
  
  // Mock data - in production this would come from API
  const trades = [
    {
      id: 1,
      name: "Mike Thompson",
      trade: "Plumber",
      location: "Manchester",
      rating: 4.9,
      reviews: 28,
      image: "/api/placeholder/150/150",
      badges: ["Verified", "Premium"],
      description: "Experienced plumber with 15+ years in the trade."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      trade: "Electrician", 
      location: "Liverpool",
      rating: 4.8,
      reviews: 35,
      image: "/api/placeholder/150/150",
      badges: ["Verified"],
      description: "Certified electrician specializing in residential work."
    }
  ]

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Find Local Tradespeople</h1>
          <p className="text-xl text-htk-platinum/80">Connect with verified professionals in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by location or trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="htk-input"
              />
            </div>
            <Button className="htk-button-primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {['all', 'plumber', 'electrician', 'carpenter', 'painter'].map(trade => (
              <Button
                key={trade}
                variant={selectedTrade === trade ? "default" : "outline"}
                onClick={() => setSelectedTrade(trade)}
                className={selectedTrade === trade ? "htk-button-primary" : "border-htk-gold text-htk-gold hover:bg-htk-gold hover:text-black"}
              >
                {trade.charAt(0).toUpperCase() + trade.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mb-12">
          <Card className="htk-card h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold htk-gold-text mb-2">Interactive Map</h3>
              <p className="text-htk-platinum/80">Coming soon - Find trades near you on the map</p>
            </div>
          </Card>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.map(trade => (
            <Card key={trade.id} className="htk-card hover:border-htk-gold cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={trade.image} 
                    alt={trade.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold htk-platinum-text">{trade.name}</h3>
                    <p className="text-htk-gold">{trade.trade}</p>
                    <div className="flex items-center gap-1 text-sm text-htk-platinum/80">
                      <MapPin className="w-3 h-3" />
                      {trade.location}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-htk-gold fill-current" />
                    <span className="font-semibold htk-gold-text">{trade.rating}</span>
                  </div>
                  <span className="text-htk-platinum/80">({trade.reviews} reviews)</span>
                </div>
                
                <div className="flex gap-2 mb-3">
                  {trade.badges.map(badge => (
                    <Badge key={badge} className="htk-badge-gold text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-htk-platinum/80 text-sm mb-4">{trade.description}</p>
                
                <Button className="w-full htk-button-primary">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {trades.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-htk-gold mx-auto mb-4" />
            <h3 className="text-2xl font-semibold htk-gold-text mb-2">You're one of the first! 🚩</h3>
            <p className="text-htk-platinum/80 max-w-md mx-auto">
              We're building our network of verified tradespeople. Be among the first to join our premium community.
            </p>
          </div>
        )}
      </div>

      <HTKFooter />
    </div>
  )
}

// Job Post Component
function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    photos: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Job posted successfully! Tradespeople will be notified.')
    // TODO: Implement job posting logic
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 htk-gold-text">Post a Job</h1>
            <p className="text-xl text-htk-platinum/80">Tell us about your project and get quotes from local tradespeople</p>
          </div>

          <Card className="htk-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="htk-label">Job Title</Label>
                  <Input
                    placeholder="e.g. Kitchen renovation, Bathroom plumbing..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="htk-input"
                    required
                  />
                </div>

                <div>
                  <Label className="htk-label">Description</Label>
                  <Textarea
                    placeholder="Describe your project in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="htk-input min-h-32"
                    required
                  />
                </div>

                <div>
                  <Label className="htk-label">Budget Range</Label>
                  <Input
                    placeholder="e.g. £500-£1000"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="htk-input"
                    required
                  />
                </div>

                <div>
                  <Label className="htk-label">Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-htk-gold/30 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-htk-gold mx-auto mb-4" />
                    <p className="text-htk-platinum/80 mb-2">Upload photos of your project</p>
                    <Button type="button" variant="outline" className="border-htk-gold text-htk-gold hover:bg-htk-gold hover:text-black">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full htk-button-primary text-lg py-3">
                  Post Job
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

// Auth Components
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual authentication
    alert('Login successful!')
    navigate('/dashboard/customer')
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="htk-card">
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-htk-platinum/80">Sign in to your HTK account</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="htk-label">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="htk-input"
                    required
                  />
                </div>
                <div>
                  <Label className="htk-label">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="htk-input"
                    required
                  />
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-htk-gold hover:underline text-sm">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full htk-button-primary">
                  Sign In
                </Button>
              </form>
              <div className="text-center mt-4">
                <span className="text-htk-platinum/80">Don't have an account? </span>
                <Link to="/signup" className="text-htk-gold hover:underline">Sign up</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function SignupPage() {
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // TODO: Implement actual registration
    alert('Registration successful!')
    navigate(userType === 'trade' ? '/dashboard/trade' : '/dashboard/customer')
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="htk-card">
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text text-2xl">Join HandyToKnow</CardTitle>
              <CardDescription className="text-htk-platinum/80">Create your account</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!userType ? (
                <div className="space-y-4">
                  <Label className="htk-label">I am a:</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setUserType('customer')}
                      className="htk-button-primary h-20"
                    >
                      Customer
                    </Button>
                    <Button
                      onClick={() => setUserType('trade')}
                      className="htk-button-primary h-20"
                    >
                      Tradesperson
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="htk-label">Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="htk-input"
                      required
                    />
                  </div>
                  <div>
                    <Label className="htk-label">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="htk-input"
                      required
                    />
                  </div>
                  <div>
                    <Label className="htk-label">Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="htk-input"
                      required
                    />
                  </div>
                  <div>
                    <Label className="htk-label">Confirm Password</Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="htk-input"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full htk-button-primary">
                    Create Account
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setUserType('')}
                    className="w-full text-htk-gold"
                  >
                    Back
                  </Button>
                </form>
              )}
              <div className="text-center mt-4">
                <span className="text-htk-platinum/80">Already have an account? </span>
                <Link to="/login" className="text-htk-gold hover:underline">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

// Dashboard Components
function CustomerDashboard() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 htk-gold-text">Customer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Active Jobs</h3>
              <div className="text-3xl font-bold htk-platinum-text">2</div>
            </CardContent>
          </Card>
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Completed Jobs</h3>
              <div className="text-3xl font-bold htk-platinum-text">8</div>
            </CardContent>
          </Card>
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Total Spent</h3>
              <div className="text-3xl font-bold htk-platinum-text">£2,400</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-16">
          <Users className="w-16 h-16 text-htk-gold mx-auto mb-4" />
          <h3 className="text-2xl font-semibold htk-gold-text mb-2">You're one of the first! 🚩</h3>
          <p className="text-htk-platinum/80 max-w-md mx-auto mb-6">
            Welcome to HTK! Start by posting your first job to connect with local tradespeople.
          </p>
          <Link to="/post">
            <Button className="htk-button-primary">Post Your First Job</Button>
          </Link>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function TradeDashboard() {
  const [credits, setCredits] = useState(12)

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold htk-gold-text">Trade Dashboard</h1>
          <div className="text-right">
            <div className="text-2xl font-bold htk-gold-text">💰 {credits} Credits</div>
            <Link to="/pricing">
              <Button className="htk-button-primary mt-2">Buy More Credits</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Credits</h3>
              <div className="text-3xl font-bold htk-platinum-text">{credits}</div>
            </CardContent>
          </Card>
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Active Leads</h3>
              <div className="text-3xl font-bold htk-platinum-text">3</div>
            </CardContent>
          </Card>
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Rating</h3>
              <div className="text-3xl font-bold htk-platinum-text">4.9</div>
            </CardContent>
          </Card>
          <Card className="htk-card">
            <CardContent className="p-6 text-center">
              <h3 className="htk-gold-text font-semibold mb-2">Jobs This Month</h3>
              <div className="text-3xl font-bold htk-platinum-text">8</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-htk-gold mx-auto mb-4" />
          <h3 className="text-2xl font-semibold htk-gold-text mb-2">You're one of the first! 🚩</h3>
          <p className="text-htk-platinum/80 max-w-md mx-auto mb-6">
            Welcome to HTK! Complete your profile to start receiving job leads from local customers.
          </p>
          <Button className="htk-button-primary">Complete Profile</Button>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

// Leaderboards Page
function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState('monthly')
  
  const leaderboardData = {
    monthly: [
      { rank: 1, name: "Mike Thompson", trade: "Plumber", rating: 4.9, jobs: 15, revenue: "£3,200", badge: "🥇" },
      { rank: 2, name: "Sarah Johnson", trade: "Electrician", rating: 4.8, jobs: 12, revenue: "£2,800", badge: "🥈" },
      { rank: 3, name: "David Wilson", trade: "Carpenter", rating: 4.7, jobs: 10, revenue: "£2,400", badge: "🥉" },
      { rank: 4, name: "Emma Davis", trade: "Painter", rating: 4.6, jobs: 8, revenue: "£1,900", badge: "" },
      { rank: 5, name: "James Brown", trade: "Roofer", rating: 4.5, jobs: 7, revenue: "£1,600", badge: "" }
    ],
    yearly: [
      { rank: 1, name: "Sarah Johnson", trade: "Electrician", rating: 4.9, jobs: 145, revenue: "£32,000", badge: "🏆" },
      { rank: 2, name: "Mike Thompson", trade: "Plumber", rating: 4.8, jobs: 132, revenue: "£28,500", badge: "🥇" },
      { rank: 3, name: "David Wilson", trade: "Carpenter", rating: 4.7, jobs: 118, revenue: "£25,200", badge: "🥈" }
    ]
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Leaderboards</h1>
          <p className="text-xl text-htk-platinum/80">Top performing tradespeople in the HTK community</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-htk-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'monthly' 
                  ? 'bg-htk-gold text-black font-semibold' 
                  : 'text-htk-platinum hover:text-htk-gold'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setActiveTab('yearly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'yearly' 
                  ? 'bg-htk-gold text-black font-semibold' 
                  : 'text-htk-platinum hover:text-htk-gold'
              }`}
            >
              This Year
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">
                {activeTab === 'monthly' ? 'Tradesperson of the Month' : 'Tradesperson of the Year'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData[activeTab].map((trader) => (
                  <div key={trader.rank} className="flex items-center justify-between p-4 bg-htk-secondary rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold htk-gold-text w-8">
                        {trader.badge || `#${trader.rank}`}
                      </div>
                      <div>
                        <h3 className="font-semibold htk-platinum-text">{trader.name}</h3>
                        <p className="text-htk-platinum/80">{trader.trade}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-center">
                      <div>
                        <div className="text-htk-gold font-semibold">{trader.rating}</div>
                        <div className="text-xs text-htk-platinum/60">Rating</div>
                      </div>
                      <div>
                        <div className="text-htk-gold font-semibold">{trader.jobs}</div>
                        <div className="text-xs text-htk-platinum/60">Jobs</div>
                      </div>
                      <div>
                        <div className="text-htk-gold font-semibold">{trader.revenue}</div>
                        <div className="text-xs text-htk-platinum/60">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8 htk-gold-text">Achievement Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold htk-platinum-text">Top Performer</h3>
              <p className="text-xs text-htk-platinum/60">100+ jobs completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold htk-platinum-text">5-Star Pro</h3>
              <p className="text-xs text-htk-platinum/60">4.8+ average rating</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold htk-platinum-text">Speed Demon</h3>
              <p className="text-xs text-htk-platinum/60">Quick response time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold htk-platinum-text">Verified Pro</h3>
              <p className="text-xs text-htk-platinum/60">Identity verified</p>
            </div>
          </div>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

// Trade Profile Page
function TradeProfilePage() {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratings, setRatings] = useState({
    quality: 0,
    punctuality: 0,
    communication: 0,
    cleanliness: 0,
    value: 0
  })

  const handleRatingSubmit = () => {
    alert('Rating submitted successfully!')
    setShowRatingModal(false)
    setRatings({ quality: 0, punctuality: 0, communication: 0, cleanliness: 0, value: 0 })
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="htk-card mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 bg-htk-secondary rounded-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-htk-gold" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold htk-gold-text mb-2">Mike Thompson</h1>
                  <p className="text-xl text-htk-platinum/80 mb-4">Master Plumber • Manchester</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-htk-gold mr-1" />
                      <span className="htk-gold-text font-semibold">4.9</span>
                      <span className="text-htk-platinum/60 ml-1">(28 reviews)</span>
                    </div>
                    <Badge className="htk-badge-gold">Verified</Badge>
                    <Badge className="htk-badge-gold">Premium</Badge>
                  </div>
                  <p className="text-htk-platinum/80">
                    Experienced plumber with 15+ years in the trade. Specializing in residential and commercial plumbing solutions.
                  </p>
                </div>
                <div className="text-center">
                  <Button className="htk-button-primary mb-2">Contact Mike</Button>
                  <Button 
                    variant="outline" 
                    className="border-htk-gold text-htk-gold hover:bg-htk-gold hover:text-black"
                    onClick={() => setShowRatingModal(true)}
                  >
                    Rate & Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio & Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-htk-secondary rounded-lg flex items-center justify-center">
                    <span className="text-htk-platinum/60">Photo 1</span>
                  </div>
                  <div className="aspect-square bg-htk-secondary rounded-lg flex items-center justify-center">
                    <span className="text-htk-platinum/60">Photo 2</span>
                  </div>
                  <div className="aspect-square bg-htk-secondary rounded-lg flex items-center justify-center">
                    <span className="text-htk-platinum/60">Photo 3</span>
                  </div>
                  <div className="aspect-square bg-htk-secondary rounded-lg flex items-center justify-center">
                    <span className="text-htk-platinum/60">Photo 4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Video Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-htk-secondary rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-htk-gold mx-auto mb-2" />
                    <p className="text-htk-platinum/60">Video coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b border-htk-gold/20 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold htk-platinum-text">John Smith</h4>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-4 h-4 text-htk-gold fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-htk-platinum/80">
                    "Excellent work on our bathroom renovation. Mike was professional, punctual, and cleaned up after himself. Highly recommended!"
                  </p>
                  <p className="text-htk-platinum/60 text-sm mt-2">2 weeks ago</p>
                </div>
                <div className="border-b border-htk-gold/20 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold htk-platinum-text">Sarah Wilson</h4>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-4 h-4 text-htk-gold fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-htk-platinum/80">
                    "Fixed our emergency leak quickly and efficiently. Great communication throughout the process."
                  </p>
                  <p className="text-htk-platinum/60 text-sm mt-2">1 month ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Modal */}
        <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
          <DialogContent className="htk-card max-w-md">
            <DialogHeader>
              <DialogTitle className="htk-gold-text">Rate Mike Thompson</DialogTitle>
              <DialogDescription className="text-htk-platinum/80">
                Rate your experience across these 5 criteria
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {Object.entries(ratings).map(([criteria, rating]) => (
                <div key={criteria}>
                  <Label className="htk-label capitalize">{criteria}</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRatings({...ratings, [criteria]: star})}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= rating ? 'text-htk-gold fill-current' : 'text-htk-platinum/30'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <Label className="htk-label">Written Review (Optional)</Label>
                <Textarea 
                  placeholder="Share your experience..."
                  className="htk-input mt-2"
                />
              </div>
              <Button onClick={handleRatingSubmit} className="w-full htk-button-primary">
                Submit Rating
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <HTKFooter />
    </div>
  )
}

// Community Pages
function CompetitionsPage() {
  const competitions = [
    {
      title: "Tradesperson of the Month",
      description: "Compete for the highest customer satisfaction rating this month",
      prize: "£500 cash + Featured profile",
      deadline: "End of month",
      participants: 45,
      status: "active"
    },
    {
      title: "Best Bathroom Renovation",
      description: "Submit your best bathroom transformation photos",
      prize: "£1,000 + Tool vouchers",
      deadline: "15 days left",
      participants: 23,
      status: "active"
    },
    {
      title: "Customer Choice Award",
      description: "Most recommended tradesperson by customers",
      prize: "£750 + Premium badge",
      deadline: "30 days left",
      participants: 67,
      status: "active"
    }
  ]

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Competitions</h1>
          <p className="text-xl text-htk-platinum/80">Compete with fellow tradespeople and win amazing prizes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {competitions.map((comp, index) => (
            <Card key={index} className="htk-card">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-htk-gold" />
                  <Badge className="htk-badge-gold">{comp.status}</Badge>
                </div>
                <CardTitle className="htk-gold-text">{comp.title}</CardTitle>
                <CardDescription className="text-htk-platinum/80">{comp.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold htk-platinum-text mb-1">Prize</h4>
                    <p className="text-htk-gold">{comp.prize}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold htk-platinum-text mb-1">Deadline</h4>
                    <p className="text-htk-platinum/80">{comp.deadline}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold htk-platinum-text mb-1">Participants</h4>
                    <p className="text-htk-platinum/80">{comp.participants} tradespeople</p>
                  </div>
                  <Button className="w-full htk-button-primary">Enter Competition</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Past Winners */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 htk-gold-text">Recent Winners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥇</span>
              </div>
              <h3 className="font-semibold htk-platinum-text">Sarah Johnson</h3>
              <p className="text-htk-platinum/80">October Tradesperson</p>
              <p className="text-htk-gold">Electrician • Liverpool</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold htk-platinum-text">Mike Thompson</h3>
              <p className="text-htk-platinum/80">Best Kitchen Renovation</p>
              <p className="text-htk-gold">Plumber • Manchester</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold htk-platinum-text">David Wilson</h3>
              <p className="text-htk-platinum/80">Customer Choice Award</p>
              <p className="text-htk-gold">Carpenter • Birmingham</p>
            </div>
          </div>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function SponsorsPage() {
  const sponsors = [
    {
      name: "ToolStation",
      description: "Professional tools and equipment",
      benefit: "15% discount for HTK members",
      logo: "🔧",
      tier: "Gold Partner"
    },
    {
      name: "Screwfix",
      description: "Trade supplies and materials",
      benefit: "Trade account benefits",
      logo: "🔩",
      tier: "Silver Partner"
    },
    {
      name: "Wickes",
      description: "Building materials and supplies",
      benefit: "Bulk purchase discounts",
      logo: "🏗️",
      tier: "Bronze Partner"
    }
  ]

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Our Sponsors</h1>
          <p className="text-xl text-htk-platinum/80">Partners who support the HTK community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {sponsors.map((sponsor, index) => (
            <Card key={index} className="htk-card">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{sponsor.logo}</div>
                <CardTitle className="htk-gold-text">{sponsor.name}</CardTitle>
                <Badge className="htk-badge-gold">{sponsor.tier}</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-htk-platinum/80 mb-4">{sponsor.description}</p>
                <div className="bg-htk-secondary p-4 rounded-lg">
                  <h4 className="font-semibold htk-gold-text mb-2">Member Benefit</h4>
                  <p className="text-htk-platinum/80">{sponsor.benefit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 htk-gold-text">Partnership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <h3 className="font-semibold htk-platinum-text mb-2">Exclusive Discounts</h3>
              <p className="text-htk-platinum/60 text-sm">Special pricing for HTK members</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <h3 className="font-semibold htk-platinum-text mb-2">Quality Guarantee</h3>
              <p className="text-htk-platinum/60 text-sm">Verified quality products</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <h3 className="font-semibold htk-platinum-text mb-2">Fast Delivery</h3>
              <p className="text-htk-platinum/60 text-sm">Priority shipping options</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-htk-gold mx-auto mb-4" />
              <h3 className="font-semibold htk-platinum-text mb-2">Trade Support</h3>
              <p className="text-htk-platinum/60 text-sm">Dedicated trade customer service</p>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="mt-16 text-center">
          <Card className="htk-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold htk-gold-text mb-4">Become a Partner</h3>
              <p className="text-htk-platinum/80 mb-6">
                Join our growing network of partners and reach thousands of professional tradespeople.
              </p>
              <Button className="htk-button-primary">Contact Partnership Team</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function CommunityPage() {
  const forumTopics = [
    {
      title: "Best practices for customer communication",
      author: "Mike Thompson",
      replies: 23,
      lastActivity: "2 hours ago",
      category: "Tips & Advice"
    },
    {
      title: "Recommended tools for bathroom renovations",
      author: "Sarah Johnson", 
      replies: 15,
      lastActivity: "4 hours ago",
      category: "Tools & Equipment"
    },
    {
      title: "How to handle difficult customers",
      author: "David Wilson",
      replies: 31,
      lastActivity: "1 day ago",
      category: "Business"
    }
  ]

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Community</h1>
          <p className="text-xl text-htk-platinum/80">Connect with fellow tradespeople and customers</p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="htk-card text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-htk-gold mx-auto mb-2" />
              <div className="text-2xl font-bold htk-gold-text">2,500+</div>
              <div className="text-htk-platinum/80 text-sm">Active Members</div>
            </CardContent>
          </Card>
          <Card className="htk-card text-center">
            <CardContent className="p-6">
              <Calendar className="w-8 h-8 text-htk-gold mx-auto mb-2" />
              <div className="text-2xl font-bold htk-gold-text">150+</div>
              <div className="text-htk-platinum/80 text-sm">Daily Posts</div>
            </CardContent>
          </Card>
          <Card className="htk-card text-center">
            <CardContent className="p-6">
              <Trophy className="w-8 h-8 text-htk-gold mx-auto mb-2" />
              <div className="text-2xl font-bold htk-gold-text">50+</div>
              <div className="text-htk-platinum/80 text-sm">Expert Contributors</div>
            </CardContent>
          </Card>
          <Card className="htk-card text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-htk-gold mx-auto mb-2" />
              <div className="text-2xl font-bold htk-gold-text">4.9/5</div>
              <div className="text-htk-platinum/80 text-sm">Community Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Forum Topics */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 htk-gold-text">Recent Discussions</h2>
          <div className="space-y-4">
            {forumTopics.map((topic, index) => (
              <Card key={index} className="htk-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className="htk-badge-gold">{topic.category}</Badge>
                        <h3 className="font-semibold htk-platinum-text">{topic.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-htk-platinum/60">
                        <span>By {topic.author}</span>
                        <span>•</span>
                        <span>{topic.replies} replies</span>
                        <span>•</span>
                        <span>{topic.lastActivity}</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-htk-gold hover:text-htk-gold">
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-htk-gold mt-1" />
                  <div>
                    <h4 className="font-semibold htk-platinum-text">Be Respectful</h4>
                    <p className="text-htk-platinum/80 text-sm">Treat all members with courtesy and professionalism</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-htk-gold mt-1" />
                  <div>
                    <h4 className="font-semibold htk-platinum-text">Share Knowledge</h4>
                    <p className="text-htk-platinum/80 text-sm">Help others by sharing your expertise and experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-htk-gold mt-1" />
                  <div>
                    <h4 className="font-semibold htk-platinum-text">Stay On Topic</h4>
                    <p className="text-htk-platinum/80 text-sm">Keep discussions relevant to trades and the HTK community</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 htk-gold-text">Contact Us</h1>
            <p className="text-xl text-htk-platinum/80">Get in touch with the HTK team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="htk-card">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-htk-gold mx-auto mb-4" />
                <h3 className="font-semibold htk-gold-text mb-2">Email</h3>
                <p className="text-htk-platinum/80">support@handytoknow.com</p>
              </CardContent>
            </Card>
            <Card className="htk-card">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-htk-gold mx-auto mb-4" />
                <h3 className="font-semibold htk-gold-text mb-2">Phone</h3>
                <p className="text-htk-platinum/80">+44 20 1234 5678</p>
              </CardContent>
            </Card>
          </div>

          <Card className="htk-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="htk-label">Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="htk-input"
                    required
                  />
                </div>
                <div>
                  <Label className="htk-label">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="htk-input"
                    required
                  />
                </div>
                <div>
                  <Label className="htk-label">Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="htk-input min-h-32"
                    required
                  />
                </div>
                <Button type="submit" className="w-full htk-button-primary">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function SuccessPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <Star className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Success!</h1>
          <p className="text-xl text-htk-platinum/80 mb-8">Your action was completed successfully.</p>
          <Link to="/">
            <Button className="htk-button-primary">Return Home</Button>
          </Link>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Password reset link sent to your email!')
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="htk-card">
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text text-2xl">Reset Password</CardTitle>
              <CardDescription className="text-htk-platinum/80">Enter your email to receive a reset link</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="htk-label">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="htk-input"
                    required
                  />
                </div>
                <Button type="submit" className="w-full htk-button-primary">
                  Send Reset Link
                </Button>
              </form>
              <div className="text-center mt-4">
                <Link to="/login" className="text-htk-gold hover:underline">Back to Login</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="htk-bg-primary min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/trades" element={<TradesPage />} />
          <Route path="/post" element={<PostJobPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/trade" element={<TradeDashboard />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/trade-profile/:id" element={<TradeProfilePage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
