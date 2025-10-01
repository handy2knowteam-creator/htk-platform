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

// Community Pages
function CompetitionsPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Competitions</h1>
          <p className="text-xl text-htk-platinum/80">Compete with fellow tradespeople and win amazing prizes</p>
        </div>

        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-htk-gold mx-auto mb-4" />
          <h3 className="text-2xl font-semibold htk-gold-text mb-2">Coming Soon</h3>
          <p className="text-htk-platinum/80 max-w-md mx-auto">
            Exciting competitions and challenges are coming to HTK. Stay tuned for updates!
          </p>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function SponsorsPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Our Sponsors</h1>
          <p className="text-xl text-htk-platinum/80">Partners who support the HTK community</p>
        </div>

        <div className="text-center py-16">
          <Shield className="w-16 h-16 text-htk-gold mx-auto mb-4" />
          <h3 className="text-2xl font-semibold htk-gold-text mb-2">Coming Soon</h3>
          <p className="text-htk-platinum/80 max-w-md mx-auto">
            We're building partnerships with leading brands in the trade industry.
          </p>
        </div>
      </div>

      <HTKFooter />
    </div>
  )
}

function CommunityPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 htk-gold-text">Community</h1>
          <p className="text-xl text-htk-platinum/80">Connect with fellow tradespeople and customers</p>
        </div>

        <div className="text-center py-16">
          <Users className="w-16 h-16 text-htk-gold mx-auto mb-4" />
          <h3 className="text-2xl font-semibold htk-gold-text mb-2">Coming Soon</h3>
          <p className="text-htk-platinum/80 max-w-md mx-auto">
            A vibrant community space for sharing tips, advice, and connecting with peers.
          </p>
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
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
