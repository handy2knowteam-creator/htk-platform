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

// Customer Signup Component
function CustomerSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    jobDescription: '',
    budget: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.postcode) {
        alert('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      const customerData = {
        id: Date.now().toString(),
        ...formData,
        type: 'customer',
        registeredAt: new Date().toISOString(),
        status: 'active'
      }

      // Save to localStorage
      const existingCustomers = JSON.parse(localStorage.getItem('htk_customers') || '[]')
      existingCustomers.push(customerData)
      localStorage.setItem('htk_customers', JSON.stringify(existingCustomers))

      const existingUsers = JSON.parse(localStorage.getItem('htk_users') || '[]')
      existingUsers.push(customerData)
      localStorage.setItem('htk_users', JSON.stringify(existingUsers))

      alert(`Thank you ${formData.name}! Your job request has been submitted. We'll be in touch within 24 hours.`)
      navigate('/success?type=customer')

    } catch (error) {
      console.error('Customer registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold htk-gold-text mb-2">Get Your Job Done</h1>
            <p className="text-htk-platinum/80">Tell us about your project and we'll connect you with verified tradespeople</p>
          </div>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">Customer Sign-Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="htk-gold-text">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="htk-input"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="htk-gold-text">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="htk-input"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="htk-gold-text">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="07123 456789"
                      className="htk-input"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="postcode" className="htk-gold-text">Postcode *</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      type="text"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="SW1A 1AA"
                      className="htk-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="jobDescription" className="htk-gold-text">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    placeholder="Describe your project in detail..."
                    className="htk-input min-h-[120px]"
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="budget" className="htk-gold-text">Budget Range</Label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="htk-input w-full"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under £500">Under £500</option>
                    <option value="£500 - £1,000">£500 - £1,000</option>
                    <option value="£1,000 - £2,500">£1,000 - £2,500</option>
                    <option value="£2,500 - £5,000">£2,500 - £5,000</option>
                    <option value="£5,000 - £10,000">£5,000 - £10,000</option>
                    <option value="Over £10,000">Over £10,000</option>
                  </select>
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="htk-button-primary w-full md:w-auto px-12 py-3"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Job Request'}
                  </Button>
                </div>

                <div className="text-center text-sm text-htk-platinum/60">
                  <p>* Required fields</p>
                  <p>By submitting, you agree to our Terms of Service and Privacy Policy</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

// Trade Signup Component
function TradeSignup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    servicesOffered: '',
    coverageArea: '',
    insuranceFile: null,
    selectedPlan: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const subscriptionPlans = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: '£29',
      period: '/month',
      features: [
        'Up to 10 leads per month',
        'Basic profile listing',
        'Customer messaging',
        'Mobile app access',
        'Email support'
      ]
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '£49',
      period: '/month',
      popular: true,
      features: [
        'Up to 25 leads per month',
        'Enhanced profile with photos',
        'Priority listing',
        'Customer messaging',
        'Mobile app access',
        'Phone support',
        'Basic analytics'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '£79',
      period: '/month',
      features: [
        'Up to 50 leads per month',
        'Premium profile with video',
        'Top priority listing',
        'Advanced customer messaging',
        'Mobile app access',
        'Priority phone support',
        'Advanced analytics',
        'Marketing tools'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '£129',
      period: '/month',
      features: [
        'Unlimited leads',
        'Premium profile with video',
        'Featured listing',
        'Advanced customer messaging',
        'Mobile app access',
        'Dedicated account manager',
        'Advanced analytics',
        'Marketing tools',
        'API access'
      ]
    }
  ]

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handlePlanSelect = (planId) => {
    setFormData({
      ...formData,
      selectedPlan: planId
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone) {
        alert('Please fill in all required fields')
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      if (!formData.servicesOffered || !formData.coverageArea) {
        alert('Please fill in all required fields')
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      if (!formData.selectedPlan) {
        alert('Please select a subscription plan')
        return
      }

      setIsSubmitting(true)

      try {
        const tradeData = {
          id: Date.now().toString(),
          ...formData,
          type: 'trade',
          registeredAt: new Date().toISOString(),
          status: 'pending',
          subscriptionStatus: 'pending'
        }

        // Save to localStorage
        const existingTrades = JSON.parse(localStorage.getItem('htk_trades') || '[]')
        existingTrades.push(tradeData)
        localStorage.setItem('htk_trades', JSON.stringify(existingTrades))

        const existingUsers = JSON.parse(localStorage.getItem('htk_users') || '[]')
        existingUsers.push(tradeData)
        localStorage.setItem('htk_users', JSON.stringify(existingUsers))

        alert(`Thank you ${formData.contactName}! Your trade registration has been submitted. You'll receive payment instructions shortly.`)
        navigate('/success?type=trade&plan=' + formData.selectedPlan)

      } catch (error) {
        console.error('Trade registration error:', error)
        alert('Registration failed. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Business Information</h2>
        <p className="text-htk-platinum/80">Tell us about your trade business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName" className="htk-gold-text">Business Name *</Label>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your Business Name Ltd"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="contactName" className="htk-gold-text">Contact Name *</Label>
          <Input
            id="contactName"
            name="contactName"
            type="text"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Your full name"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="htk-gold-text">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="business@example.com"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="htk-gold-text">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="07123 456789"
            className="htk-input"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Services & Coverage</h2>
        <p className="text-htk-platinum/80">What services do you offer and where?</p>
      </div>

      <div>
        <Label htmlFor="servicesOffered" className="htk-gold-text">Services Offered *</Label>
        <Textarea
          id="servicesOffered"
          name="servicesOffered"
          value={formData.servicesOffered}
          onChange={handleChange}
          placeholder="e.g., Plumbing, Heating, Bathroom Installation, Emergency Repairs..."
          className="htk-input min-h-[120px]"
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="coverageArea" className="htk-gold-text">Coverage Area *</Label>
        <Input
          id="coverageArea"
          name="coverageArea"
          type="text"
          value={formData.coverageArea}
          onChange={handleChange}
          placeholder="e.g., London, Surrey, 20 mile radius from SW1A 1AA"
          className="htk-input"
          required
        />
      </div>

      <div>
        <Label htmlFor="insuranceFile" className="htk-gold-text">Public Liability Insurance</Label>
        <Input
          id="insuranceFile"
          name="insuranceFile"
          type="file"
          onChange={handleChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="htk-input"
        />
        <p className="text-sm text-htk-platinum/60 mt-2">
          Upload your insurance certificate (PDF, JPG, PNG)
        </p>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Choose Your Plan</h2>
        <p className="text-htk-platinum/80">Select the subscription that works for your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`htk-card cursor-pointer transition-all duration-300 ${
              formData.selectedPlan === plan.id 
                ? 'ring-2 ring-htk-gold' 
                : 'hover:ring-1 hover:ring-htk-gold/50'
            } ${plan.popular ? 'relative' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-htk-gold text-black px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="htk-gold-text">{plan.name}</CardTitle>
              <div className="text-3xl font-bold htk-platinum-text">
                {plan.price}
                <span className="text-sm text-htk-platinum/60">{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-htk-platinum/80 flex items-center">
                    <span className="text-htk-gold mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold htk-gold-text mb-2">Join as a Trade Professional</h1>
            <p className="text-htk-platinum/80">Get connected with customers who need your expertise</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step 
                      ? 'bg-htk-gold text-black' 
                      : 'bg-htk-charcoal text-htk-platinum/60'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-htk-gold' : 'bg-htk-charcoal'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="htk-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button 
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="htk-button-secondary"
                    >
                      Back
                    </Button>
                  )}
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="htk-button-primary ml-auto"
                  >
                    {currentStep === 3 
                      ? (isSubmitting ? 'Processing...' : 'Complete Registration')
                      : 'Continue'
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

// Admin Dashboard Component
function AdminDashboard() {
  const [customers, setCustomers] = useState([])
  const [trades, setTrades] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    totalTrades: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlySignups: 0,
    conversionRate: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const customerData = JSON.parse(localStorage.getItem('htk_customers') || '[]')
    setCustomers(customerData)

    const tradeData = JSON.parse(localStorage.getItem('htk_trades') || '[]')
    setTrades(tradeData)

    const totalCustomers = customerData.length
    const totalTrades = tradeData.length
    const activeSubscriptions = tradeData.filter(trade => trade.subscriptionStatus === 'active').length
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const monthlySignups = [...customerData, ...tradeData].filter(user => 
      new Date(user.registeredAt) > thirtyDaysAgo
    ).length

    const revenueEstimate = tradeData.reduce((total, trade) => {
      if (trade.subscriptionStatus === 'active') {
        switch (trade.selectedPlan) {
          case 'bronze': return total + 29
          case 'silver': return total + 49
          case 'gold': return total + 79
          case 'platinum': return total + 129
          default: return total
        }
      }
      return total
    }, 0)

    const conversionRate = totalCustomers > 0 ? ((totalTrades / totalCustomers) * 100).toFixed(1) : 0

    setAnalytics({
      totalCustomers,
      totalTrades,
      totalRevenue: revenueEstimate,
      activeSubscriptions,
      monthlySignups,
      conversionRate
    })
  }

  const exportCSV = (type) => {
    let data = []
    let headers = []
    let filename = ''

    if (type === 'customers') {
      data = customers
      headers = ['Name', 'Email', 'Phone', 'Postcode', 'Job Description', 'Budget', 'Registered At']
      filename = 'htk-customers.csv'
    } else if (type === 'trades') {
      data = trades
      headers = ['Business Name', 'Contact Name', 'Email', 'Phone', 'Services', 'Coverage Area', 'Plan', 'Status', 'Registered At']
      filename = 'htk-trades.csv'
    }

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (type === 'customers') {
          return [
            `"${item.name || ''}"`,
            `"${item.email || ''}"`,
            `"${item.phone || ''}"`,
            `"${item.postcode || ''}"`,
            `"${item.jobDescription || ''}"`,
            `"${item.budget || ''}"`,
            `"${item.registeredAt || ''}"`
          ].join(',')
        } else {
          return [
            `"${item.businessName || ''}"`,
            `"${item.contactName || ''}"`,
            `"${item.email || ''}"`,
            `"${item.phone || ''}"`,
            `"${item.servicesOffered || ''}"`,
            `"${item.coverageArea || ''}"`,
            `"${item.selectedPlan || ''}"`,
            `"${item.subscriptionStatus || ''}"`,
            `"${item.registeredAt || ''}"`
          ].join(',')
        }
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredUsers = () => {
    let allUsers = []
    
    if (filterType === 'all' || filterType === 'customers') {
      allUsers = [...allUsers, ...customers.map(c => ({ ...c, userType: 'customer' }))]
    }
    
    if (filterType === 'all' || filterType === 'trades') {
      allUsers = [...allUsers, ...trades.map(t => ({ ...t, userType: 'trade' }))]
    }

    if (searchTerm) {
      allUsers = allUsers.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.contactName && user.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.businessName && user.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return allUsers.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold htk-gold-text mb-2">HTK Admin Dashboard</h1>
          <p className="text-htk-platinum/80">Manage customers, trades, and platform analytics</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Total Trades</CardTitle>
              <Users className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.totalTrades}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Monthly Revenue</CardTitle>
              <PoundSterling className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">£{analytics.totalRevenue}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.activeSubscriptions}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Monthly Signups</CardTitle>
              <TrendingUp className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.monthlySignups}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="htk-input pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="htk-input"
            >
              <option value="all">All Users</option>
              <option value="customers">Customers Only</option>
              <option value="trades">Trades Only</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => exportCSV('customers')} className="htk-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Customers
            </Button>
            <Button onClick={() => exportCSV('trades')} className="htk-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Trades
            </Button>
          </div>
        </div>

        {/* User List */}
        <Card className="htk-card">
          <CardHeader>
            <CardTitle className="htk-gold-text">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers().map((user, index) => (
                <div key={index} className="border border-htk-gold/20 rounded-lg p-4 hover:border-htk-gold/40 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold htk-platinum-text">
                          {user.userType === 'customer' ? user.name : user.contactName}
                        </h3>
                        <Badge variant={user.userType === 'customer' ? 'secondary' : 'default'}>
                          {user.userType === 'customer' ? 'Customer' : 'Trade'}
                        </Badge>
                        {user.userType === 'trade' && user.selectedPlan && (
                          <Badge variant="outline" className="text-htk-gold border-htk-gold">
                            {user.selectedPlan.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-htk-platinum/80">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.registeredAt).toLocaleDateString()}
                        </div>
                      </div>

                      {user.userType === 'customer' && user.jobDescription && (
                        <div className="mt-2 p-2 bg-htk-charcoal/50 rounded text-sm">
                          <strong>Job:</strong> {user.jobDescription}
                          {user.budget && <span className="ml-2"><strong>Budget:</strong> {user.budget}</span>}
                        </div>
                      )}

                      {user.userType === 'trade' && user.servicesOffered && (
                        <div className="mt-2 p-2 bg-htk-charcoal/50 rounded text-sm">
                          <strong>Services:</strong> {user.servicesOffered}
                          {user.businessName && <span className="ml-2"><strong>Business:</strong> {user.businessName}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers().length === 0 && (
                <div className="text-center py-8 text-htk-platinum/60">
                  No users found. {searchTerm && 'Try adjusting your search terms.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <HTKFooter />
    </div>
  )
}

// Navigation Component
function HTKNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState('customer')
  const location = useLocation()

  return (
    <nav className="htk-bg-secondary border-b border-htk-gold/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/branding/HTK-logo.png" alt="HTK" className="h-8 w-auto" />
            <span className="htk-brand-text text-xl font-bold">HandyToKnow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`htk-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/how-it-works" className={`htk-nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}>How it works</Link>
            <Link to="/ask-a-trade" className={`htk-nav-link ${location.pathname === '/ask-a-trade' ? 'active' : ''}`}>Ask a trade</Link>
            <Link to="/cost-guides" className={`htk-nav-link ${location.pathname === '/cost-guides' ? 'active' : ''}`}>Cost guides</Link>
            <Link to="/post" className={`htk-nav-link ${location.pathname === '/post' ? 'active' : ''}`}>Post a Job</Link>
            <Link to="/trades" className={`htk-nav-link ${location.pathname === '/trades' ? 'active' : ''}`}>Find Trades</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-htk-platinum hover:text-htk-gold">Login</Button>
                </Link>
                <Link to="/customer-signup">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-htk-gold hover:text-htk-platinum focus:outline-none focus:text-htk-platinum"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-dropdown md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className={`mobile-menu-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/pricing" 
                className={`mobile-menu-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/trades" 
                className={`mobile-menu-link ${location.pathname === '/trades' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Trades
              </Link>
              <Link 
                to="/post" 
                className={`mobile-menu-link ${location.pathname === '/post' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Job
              </Link>
              <Link 
                to="/competitions" 
                className={`mobile-menu-link ${location.pathname === '/competitions' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Competitions
              </Link>
              <Link 
                to="/leaderboards" 
                className={`mobile-menu-link ${location.pathname === '/leaderboards' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboards
              </Link>
              <Link 
                to="/community" 
                className={`mobile-menu-link ${location.pathname === '/community' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/contact" 
                className={`mobile-menu-link ${location.pathname === '/contact' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="border-t border-htk-gold/20 pt-4 mt-4">
                {!isLoggedIn ? (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-htk-platinum hover:text-htk-gold">Login</Button>
                    </Link>
                    <Link to="/customer-signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full htk-button-primary">Join HTK</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to={userType === 'trade' ? '/dashboard/trade' : '/dashboard/customer'} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-htk-platinum hover:text-htk-gold">Dashboard</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsLoggedIn(false)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-htk-platinum hover:text-htk-gold"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Footer Component
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
              <Link to="/admin" className="block text-htk-platinum/80 hover:text-htk-gold text-sm">Admin</Link>
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

// Main App Component with all existing pages
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </div>
    </Router>
  )
}

// HomePage Component
function HomePage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold htk-gold-text mb-6">
            Find Tradespeople, Compare Up to 3 Quotes!
          </h1>
          <p className="text-xl text-htk-platinum/80 mb-8 max-w-3xl mx-auto">
            It's FREE and there are no obligations
          </p>
          
          {/* Postcode Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Enter your postcode" 
                className="flex-1 px-4 py-3 rounded-l-lg text-black text-lg border-0"
              />
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-r-lg font-semibold text-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                Get Started
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/customer-signup">
              <Button className="htk-button-primary text-lg px-8 py-4">
                I Need a Tradesperson
              </Button>
            </Link>
            <Link to="/trade-signup">
              <Button className="htk-button-secondary text-lg px-8 py-4">
                I Am a Tradesperson
              </Button>
            </Link>
          </div>
          
          <p className="text-htk-platinum/60">
            Over 50,000 tradespeople nationwide use HandyToKnow
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 htk-bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold htk-gold-text mb-2">2,500+</div>
              <div className="text-htk-platinum/80">Verified Trades</div>
            </div>
            <div>
              <div className="text-4xl font-bold htk-gold-text mb-2">15,000+</div>
              <div className="text-htk-platinum/80">Jobs Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold htk-gold-text mb-2">4.9★</div>
              <div className="text-htk-platinum/80">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold htk-gold-text mb-2">£2.5M+</div>
              <div className="text-htk-platinum/80">Paid to Trades</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold htk-gold-text text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold htk-platinum-text mb-2">Post Your Job</h3>
              <p className="text-htk-platinum/80">Tell us about the work you need doing around your home.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold htk-platinum-text mb-2">Receive up to 3 quotes</h3>
              <p className="text-htk-platinum/80">Up to 3 local trades will then be in touch to quote for the work.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold htk-platinum-text mb-2">Choose your tradesperson</h3>
              <p className="text-htk-platinum/80">Compare quotes then choose your preferred tradesman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Completed Jobs */}
      <section className="py-20 htk-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold htk-gold-text text-center mb-12">Recent Completed Jobs</h2>
          <p className="text-center text-htk-platinum/80 mb-12">Join over 1,000,000 happy homeowners who have posted their job on HandyToKnow</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="htk-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold htk-gold-text">Plumber job in Manchester</h3>
                  <p className="text-sm text-htk-platinum/60 mb-2">Review for Mike Thompson</p>
                </div>
                <p className="text-htk-platinum/80 mb-4">
                  "Excellent tradesman. Professional, tidy and very good finished job. Will have Mike back again and could safely recommend to anyone."
                </p>
                <div className="flex items-center">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-htk-gold text-htk-gold" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="htk-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold htk-gold-text">Electrician job in London</h3>
                  <p className="text-sm text-htk-platinum/60 mb-2">Review for Sarah Johnson</p>
                </div>
                <p className="text-htk-platinum/80 mb-4">
                  "Sarah arrived on time and was friendly and polite. The job was well done and the area was tidied up on completion. Very happy."
                </p>
                <div className="flex items-center">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-htk-gold text-htk-gold" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="htk-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold htk-gold-text">Carpenter job in Birmingham</h3>
                  <p className="text-sm text-htk-platinum/60 mb-2">Review for David Wilson</p>
                </div>
                <p className="text-htk-platinum/80 mb-4">
                  "Couldn't give a higher recommendation! He did a fabulous job and was very warm and professional."
                </p>
                <div className="flex items-center">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-htk-gold text-htk-gold" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <HTKFooter />
    </div>
  )
}

// How It Works Page
function HowItWorksPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold htk-gold-text text-center mb-8">How HandyToKnow Works</h1>
          <p className="text-xl text-htk-platinum/80 text-center mb-12">
            Getting quality tradespeople for your home has never been easier
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-black">1</span>
              </div>
              <h3 className="text-2xl font-semibold htk-gold-text mb-4">Tell us what you need</h3>
              <p className="text-htk-platinum/80">Answer a few questions about your project. It takes less than 2 minutes and it's completely free.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-black">2</span>
              </div>
              <h3 className="text-2xl font-semibold htk-gold-text mb-4">Get matched with trades</h3>
              <p className="text-htk-platinum/80">We'll find up to 3 trusted local tradespeople who are available and want to quote for your job.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-htk-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-black">3</span>
              </div>
              <h3 className="text-2xl font-semibold htk-gold-text mb-4">Compare and choose</h3>
              <p className="text-htk-platinum/80">Compare quotes, read reviews, and choose the tradesperson that's right for you and your budget.</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/customer-signup">
              <Button className="htk-button-primary text-lg px-8 py-4">
                Get Started - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

// Ask a Trade Page
function AskATradePage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold htk-gold-text text-center mb-8">Ask a Trade</h1>
          <p className="text-xl text-htk-platinum/80 text-center mb-12">
            Get expert advice from verified tradespeople
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Recent Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-htk-gold/20 pb-4">
                  <h3 className="font-semibold htk-platinum-text mb-2">How much should I expect to pay for a new boiler?</h3>
                  <p className="text-sm text-htk-platinum/60 mb-2">Asked by Sarah M. • 2 hours ago</p>
                  <p className="text-htk-platinum/80">Looking to replace my old boiler. What's a reasonable price range for a good quality combi boiler including installation?</p>
                  <div className="mt-2">
                    <span className="text-sm htk-gold-text">3 expert answers</span>
                  </div>
                </div>
                
                <div className="border-b border-htk-gold/20 pb-4">
                  <h3 className="font-semibold htk-platinum-text mb-2">Best time of year for roof repairs?</h3>
                  <p className="text-sm text-htk-platinum/60 mb-2">Asked by John D. • 1 day ago</p>
                  <p className="text-htk-platinum/80">When is the best time to get roof work done? Weather considerations and cost factors?</p>
                  <div className="mt-2">
                    <span className="text-sm htk-gold-text">5 expert answers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Ask Your Question</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label className="htk-gold-text">Your Question</Label>
                    <Textarea 
                      placeholder="What would you like to ask our expert tradespeople?"
                      className="htk-input"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label className="htk-gold-text">Category</Label>
                    <select className="htk-input w-full">
                      <option>Select a category</option>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>Building</option>
                      <option>Roofing</option>
                      <option>Heating</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <Button className="htk-button-primary w-full">
                    Ask Question
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

// Cost Guides Page
function CostGuidesPage() {
  const costGuides = [
    { title: "Boiler Installation Cost", range: "£1,500 - £3,500", description: "Complete guide to boiler replacement costs including labour and materials" },
    { title: "Kitchen Extension Cost", range: "£15,000 - £30,000", description: "Everything you need to know about single-storey kitchen extension costs" },
    { title: "Bathroom Renovation Cost", range: "£3,000 - £8,000", description: "Full bathroom refurbishment costs from budget to luxury" },
    { title: "Roof Replacement Cost", range: "£5,000 - £15,000", description: "Complete roof replacement costs for different property types" },
    { title: "Driveway Installation Cost", range: "£1,200 - £4,000", description: "Block paving, tarmac and gravel driveway installation costs" },
    { title: "Central Heating Cost", range: "£2,500 - £6,000", description: "Full central heating system installation costs and considerations" }
  ]

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold htk-gold-text text-center mb-8">Cost Guides</h1>
          <p className="text-xl text-htk-platinum/80 text-center mb-12">
            Get realistic price estimates for your home improvement projects
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costGuides.map((guide, index) => (
              <Card key={index} className="htk-card hover:border-htk-gold/40 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold htk-gold-text mb-2">{guide.title}</h3>
                  <div className="text-2xl font-bold htk-platinum-text mb-3">{guide.range}</div>
                  <p className="text-htk-platinum/80 mb-4">{guide.description}</p>
                  <Button className="htk-button-secondary w-full">
                    View Full Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-htk-platinum/80 mb-6">
              Need a more accurate quote for your specific project?
            </p>
            <Link to="/customer-signup">
              <Button className="htk-button-primary text-lg px-8 py-4">
                Get Personalized Quotes
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

// Placeholder components for existing pages
function PricingPage() {
  const plans = [
    {
      name: 'Bronze',
      price: '£29',
      period: '/month',
      features: [
        '5 leads per month',
        'Basic profile listing',
        'Customer contact details',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Silver',
      price: '£49',
      period: '/month',
      features: [
        '15 leads per month',
        'Enhanced profile with photos',
        'Priority listing',
        'Customer contact details',
        'Phone support',
        'Basic analytics'
      ],
      popular: true
    },
    {
      name: 'Gold',
      price: '£79',
      period: '/month',
      features: [
        '30 leads per month',
        'Premium profile with video',
        'Top priority listing',
        'Customer contact details',
        'Priority phone support',
        'Advanced analytics',
        'Marketing tools'
      ],
      popular: false
    },
    {
      name: 'Platinum',
      price: '£129',
      period: '/month',
      features: [
        'Unlimited leads',
        'Premium profile with video',
        'Featured listing',
        'Customer contact details',
        'Dedicated account manager',
        'Advanced analytics',
        'Marketing tools',
        'API access'
      ],
      popular: false
    }
  ]

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold htk-gold-text mb-4">Pricing Plans</h1>
          <p className="text-xl text-htk-platinum/80 max-w-2xl mx-auto">
            Choose the plan that works for your business. All plans include verified customer leads and professional tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`htk-card relative ${plan.popular ? 'border-htk-gold' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-htk-gold text-htk-charcoal font-semibold px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="htk-gold-text text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold htk-platinum-text">{plan.price}</span>
                  <span className="text-htk-platinum/60">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-htk-platinum/80">
                      <Star className="h-4 w-4 text-htk-gold mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button className={`w-full mt-6 ${plan.popular ? 'htk-button-primary' : 'htk-button-secondary'}`}>
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-htk-platinum/60 mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-htk-platinum/80">
            <span>✓ Verified customer leads</span>
            <span>✓ Professional profile</span>
            <span>✓ Secure payments</span>
            <span>✓ Customer reviews</span>
            <span>✓ Mobile app access</span>
          </div>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

function TradesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTrade, setSelectedTrade] = useState('all')
  const [location, setLocation] = useState('')

  const trades = [
    {
      id: 1,
      name: 'Mike Thompson',
      trade: 'Plumber',
      rating: 4.9,
      reviews: 28,
      location: 'London, SW1',
      image: '/api/placeholder/100/100',
      specialties: ['Emergency Repairs', 'Bathroom Installation', 'Boiler Service'],
      verified: true,
      responseTime: '< 2 hours'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      trade: 'Electrician',
      rating: 4.8,
      reviews: 35,
      location: 'London, NW3',
      image: '/api/placeholder/100/100',
      specialties: ['Rewiring', 'Smart Home Setup', 'Safety Inspections'],
      verified: true,
      responseTime: '< 1 hour'
    },
    {
      id: 3,
      name: 'David Wilson',
      trade: 'Carpenter',
      rating: 4.7,
      reviews: 22,
      location: 'London, SE10',
      image: '/api/placeholder/100/100',
      specialties: ['Kitchen Fitting', 'Built-in Storage', 'Flooring'],
      verified: true,
      responseTime: '< 3 hours'
    },
    {
      id: 4,
      name: 'Emma Brown',
      trade: 'Painter',
      rating: 4.9,
      reviews: 31,
      location: 'London, W2',
      image: '/api/placeholder/100/100',
      specialties: ['Interior Painting', 'Exterior Painting', 'Wallpapering'],
      verified: true,
      responseTime: '< 2 hours'
    }
  ]

  const tradeTypes = ['all', 'plumber', 'electrician', 'carpenter', 'painter', 'builder', 'gardener']

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTrade = selectedTrade === 'all' || trade.trade.toLowerCase() === selectedTrade
    const matchesLocation = !location || trade.location.toLowerCase().includes(location.toLowerCase())
    
    return matchesSearch && matchesTrade && matchesLocation
  })

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold htk-gold-text mb-4">Find Trades</h1>
          <p className="text-xl text-htk-platinum/80 max-w-2xl mx-auto">
            Browse verified tradespeople in your area. All our professionals are vetted, insured, and rated by real customers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="htk-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label className="htk-gold-text mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 h-4 w-4" />
                    <Input
                      placeholder="Search by name, trade, or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="htk-input pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="htk-gold-text mb-2 block">Trade Type</Label>
                  <select
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="htk-input w-full"
                  >
                    {tradeTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Trades' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label className="htk-gold-text mb-2 block">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 h-4 w-4" />
                    <Input
                      placeholder="Enter postcode or area..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="htk-input pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tradeTypes.slice(1).map(type => (
                  <Button
                    key={type}
                    variant={selectedTrade === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTrade(type)}
                    className={selectedTrade === type ? "htk-button-primary" : "htk-button-secondary"}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold htk-gold-text">
              {filteredTrades.length} Professional{filteredTrades.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="text-htk-platinum/60">
              Showing results for {selectedTrade === 'all' ? 'all trades' : selectedTrade}
              {location && ` in ${location}`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrades.map(trade => (
              <Card key={trade.id} className="htk-card hover:border-htk-gold/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-htk-gold/20 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-htk-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold htk-platinum-text">{trade.name}</h3>
                        {trade.verified && (
                          <Badge className="bg-htk-gold text-htk-charcoal text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-htk-gold font-medium">{trade.trade}</p>
                      <p className="text-htk-platinum/60 text-sm">{trade.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-htk-gold fill-current" />
                      <span className="font-semibold htk-platinum-text">{trade.rating}</span>
                      <span className="text-htk-platinum/60 text-sm">({trade.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-htk-platinum/60">
                      <Clock className="h-3 w-3" />
                      {trade.responseTime}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-htk-platinum/80 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {trade.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-htk-gold border-htk-gold/40">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 htk-button-primary">
                      View Profile
                    </Button>
                    <Button className="htk-button-secondary">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrades.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-htk-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-htk-gold" />
              </div>
              <h3 className="text-xl font-semibold htk-gold-text mb-2">No trades found</h3>
              <p className="text-htk-platinum/60 mb-4">
                Try adjusting your search criteria or location
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedTrade('all')
                  setLocation('')
                }}
                className="htk-button-secondary"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    timeline: '',
    location: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    photos: []
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting & Decorating', 
    'Building & Construction', 'Gardening & Landscaping', 'Cleaning',
    'Roofing', 'Heating & Cooling', 'Flooring', 'Kitchen & Bathroom',
    'Handyman Services', 'Other'
  ]

  const budgetRanges = [
    'Under £500', '£500 - £1,000', '£1,000 - £2,500', '£2,500 - £5,000',
    '£5,000 - £10,000', '£10,000 - £20,000', 'Over £20,000', 'Not sure'
  ]

  const timelineOptions = [
    'ASAP', 'Within 1 week', 'Within 2 weeks', 'Within 1 month',
    'Within 3 months', 'Flexible', 'Not sure'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Job posted successfully! You will receive quotes from verified tradespeople soon.')
    setIsSubmitting(false)
    
    // Reset form
    setFormData({
      title: '', description: '', category: '', budget: '', timeline: '',
      location: '', contactName: '', contactEmail: '', contactPhone: '', photos: []
    })
    setCurrentStep(1)
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold htk-gold-text mb-4">Post a Job</h1>
            <p className="text-xl text-htk-platinum/80 max-w-2xl mx-auto">
              Describe your project and get quotes from verified tradespeople in your area
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-htk-gold text-htk-charcoal' 
                      : 'bg-htk-platinum/20 text-htk-platinum/60'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-htk-gold' : 'bg-htk-platinum/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="htk-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Job Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold htk-gold-text mb-2">Job Details</h2>
                      <p className="text-htk-platinum/60">Tell us about your project</p>
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Job Title *</Label>
                      <Input
                        placeholder="e.g., Kitchen renovation, Bathroom plumbing repair..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="htk-input"
                        required
                      />
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Category *</Label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="htk-input w-full"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Job Description *</Label>
                      <textarea
                        placeholder="Describe your project in detail. Include any specific requirements, materials needed, or preferences..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="htk-input min-h-32 resize-y"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="htk-gold-text mb-2 block">Budget Range *</Label>
                        <select
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          className="htk-input w-full"
                          required
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map(range => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="htk-gold-text mb-2 block">Timeline *</Label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => handleInputChange('timeline', e.target.value)}
                          className="htk-input w-full"
                          required
                        >
                          <option value="">When do you need this done?</option>
                          {timelineOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="htk-button-primary"
                        disabled={!formData.title || !formData.category || !formData.description || !formData.budget || !formData.timeline}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Photos */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold htk-gold-text mb-2">Location & Photos</h2>
                      <p className="text-htk-platinum/60">Help tradespeople understand your project better</p>
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 h-4 w-4" />
                        <Input
                          placeholder="Enter your postcode or area (e.g., SW1A 1AA, Central London)"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="htk-input pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Photos (Optional)</Label>
                      <div className="border-2 border-dashed border-htk-gold/30 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-htk-gold mx-auto mb-4" />
                        <p className="text-htk-platinum/80 mb-2">Upload photos of your project area</p>
                        <p className="text-sm text-htk-platinum/60 mb-4">
                          Photos help tradespeople provide more accurate quotes
                        </p>
                        <Button type="button" className="htk-button-secondary">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" onClick={prevStep} className="htk-button-secondary">
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="htk-button-primary"
                        disabled={!formData.location}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold htk-gold-text mb-2">Contact Information</h2>
                      <p className="text-htk-platinum/60">How should tradespeople contact you?</p>
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Full Name *</Label>
                      <Input
                        placeholder="Your full name"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        className="htk-input"
                        required
                      />
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="htk-input"
                        required
                      />
                    </div>

                    <div>
                      <Label className="htk-gold-text mb-2 block">Phone Number *</Label>
                      <Input
                        type="tel"
                        placeholder="07123 456789"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="htk-input"
                        required
                      />
                    </div>

                    <div className="bg-htk-gold/10 border border-htk-gold/30 rounded-lg p-4">
                      <h3 className="font-semibold htk-gold-text mb-2">What happens next?</h3>
                      <ul className="text-sm text-htk-platinum/80 space-y-1">
                        <li>• Your job will be visible to verified tradespeople in your area</li>
                        <li>• You'll receive quotes within 24-48 hours</li>
                        <li>• Compare profiles, reviews, and prices</li>
                        <li>• Choose the best tradesperson for your project</li>
                      </ul>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="rounded border-htk-gold/40" required />
                      <Label htmlFor="terms" className="text-sm text-htk-platinum/80">
                        I agree to the <a href="/terms" className="text-htk-gold hover:underline">Terms of Service</a> and <a href="/privacy" className="text-htk-gold hover:underline">Privacy Policy</a>
                      </Label>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" onClick={prevStep} className="htk-button-secondary">
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="htk-button-primary"
                        disabled={isSubmitting || !formData.contactName || !formData.contactEmail || !formData.contactPhone}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Posting Job...
                          </>
                        ) : (
                          'Post Job'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

function CompetitionsPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Competitions</h1>
        <p className="text-center text-htk-platinum/80">Win prizes and recognition for your work</p>
      </div>
      <HTKFooter />
    </div>
  )
}

function LeaderboardsPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Leaderboards</h1>
        <p className="text-center text-htk-platinum/80">Top rated tradespeople based on customer reviews</p>
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
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Community</h1>
        <p className="text-center text-htk-platinum/80">Connect with other tradespeople and share knowledge</p>
      </div>
      <HTKFooter />
    </div>
  )
}

function ContactPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Contact Us</h1>
        <p className="text-center text-htk-platinum/80">Get in touch with our team</p>
      </div>
      <HTKFooter />
    </div>
  )
}

function SuccessPage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const type = searchParams.get('type')
  
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold htk-gold-text mb-8">Success!</h1>
        <p className="text-htk-platinum/80 mb-8">
          {type === 'customer' 
            ? "Your job request has been submitted. We'll be in touch within 24 hours."
            : "Your trade registration has been submitted. You'll receive payment instructions shortly."
          }
        </p>
        <Link to="/">
          <Button className="htk-button-primary">Return Home</Button>
        </Link>
      </div>
      <HTKFooter />
    </div>
  )
}

function LoginPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Login</h1>
        <p className="text-center text-htk-platinum/80">Sign in to your HTK account</p>
      </div>
      <HTKFooter />
    </div>
  )
}

function SignupPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Join HTK</h1>
        <div className="max-w-md mx-auto space-y-4">
          <Link to="/customer-signup">
            <Button className="w-full htk-button-primary">I Need a Tradesperson</Button>
          </Link>
          <Link to="/trade-signup">
            <Button className="w-full htk-button-secondary">I Am a Tradesperson</Button>
          </Link>
        </div>
      </div>
      <HTKFooter />
    </div>
  )
}

function CustomerDashboard() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Customer Dashboard</h1>
        <p className="text-center text-htk-platinum/80">Manage your jobs and find tradespeople</p>
      </div>
      <HTKFooter />
    </div>
  )
}

function TradeDashboard() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Trade Dashboard</h1>
        <p className="text-center text-htk-platinum/80">Manage your leads and grow your business</p>
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
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Sponsors</h1>
        <p className="text-center text-htk-platinum/80">Our trusted partners and sponsors</p>
      </div>
      <HTKFooter />
    </div>
  )
}

export default App
