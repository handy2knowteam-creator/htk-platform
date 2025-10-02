import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Users, Star, Clock, Zap, CreditCard, TrendingUp, Download, Search, Filter, Mail, Phone, MapPin, Calendar, Pound, Menu, X } from 'lucide-react'

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
              <Pound className="h-4 w-4 text-htk-gold" />
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
            <Link to="/pricing" className={`htk-nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}>Pricing</Link>
            <Link to="/trades" className={`htk-nav-link ${location.pathname === '/trades' ? 'active' : ''}`}>Find Trades</Link>
            <Link to="/post" className={`htk-nav-link ${location.pathname === '/post' ? 'active' : ''}`}>Post Job</Link>
            <Link to="/competitions" className={`htk-nav-link ${location.pathname === '/competitions' ? 'active' : ''}`}>Competitions</Link>
            <Link to="/leaderboards" className={`htk-nav-link ${location.pathname === '/leaderboards' ? 'active' : ''}`}>Leaderboards</Link>
            <Link to="/community" className={`htk-nav-link ${location.pathname === '/community' ? 'active' : ''}`}>Community</Link>
            <Link to="/contact" className={`htk-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
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
