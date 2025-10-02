import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'

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
      ],
      stripePriceId: 'price_bronze_monthly' // Replace with actual Stripe Price ID
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
      ],
      stripePriceId: 'price_silver_monthly' // Replace with actual Stripe Price ID
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
      ],
      stripePriceId: 'price_gold_monthly' // Replace with actual Stripe Price ID
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
      ],
      stripePriceId: 'price_platinum_monthly' // Replace with actual Stripe Price ID
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

  const sendTradeEmailNotification = async (tradeData) => {
    const emailData = {
      to: 'handy2knowteam@gmail.com',
      subject: 'New Trade Sign-Up - HTK Platform',
      html: `
        <h2>New Trade Registration</h2>
        <p><strong>Business Name:</strong> ${tradeData.businessName}</p>
        <p><strong>Contact Name:</strong> ${tradeData.contactName}</p>
        <p><strong>Email:</strong> ${tradeData.email}</p>
        <p><strong>Phone:</strong> ${tradeData.phone}</p>
        <p><strong>Services:</strong> ${tradeData.servicesOffered}</p>
        <p><strong>Coverage Area:</strong> ${tradeData.coverageArea}</p>
        <p><strong>Selected Plan:</strong> ${tradeData.selectedPlan.toUpperCase()}</p>
        <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>Insurance document uploaded: ${tradeData.insuranceFile ? 'Yes' : 'No'}</p>
        <p>Please verify and activate this trade account.</p>
      `
    }

    try {
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })
    } catch (error) {
      console.error('Trade email notification failed:', error)
    }
  }

  const handleStripeCheckout = async (plan) => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          successUrl: `${window.location.origin}/success?type=trade&plan=${plan.id}`,
          cancelUrl: `${window.location.origin}/trade-signup`,
          customerEmail: formData.email,
          metadata: {
            businessName: formData.businessName,
            contactName: formData.contactName,
            phone: formData.phone,
            servicesOffered: formData.servicesOffered,
            coverageArea: formData.coverageArea,
            plan: plan.id
          }
        })
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
      await stripe.redirectToCheckout({ sessionId })

    } catch (error) {
      console.error('Stripe checkout error:', error)
      alert('Payment setup failed. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      // Validate step 1 fields
      if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone) {
        alert('Please fill in all required fields')
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      // Validate step 2 fields
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
        // Save trade data
        const tradeData = {
          id: Date.now().toString(),
          ...formData,
          type: 'trade',
          registeredAt: new Date().toISOString(),
          status: 'pending', // Will be activated after payment
          subscriptionStatus: 'pending'
        }

        // Save to localStorage
        const existingTrades = JSON.parse(localStorage.getItem('htk_trades') || '[]')
        existingTrades.push(tradeData)
        localStorage.setItem('htk_trades', JSON.stringify(existingTrades))

        // Also save to general users list
        const existingUsers = JSON.parse(localStorage.getItem('htk_users') || '[]')
        existingUsers.push(tradeData)
        localStorage.setItem('htk_users', JSON.stringify(existingUsers))

        // Send email notification
        await sendTradeEmailNotification(tradeData)

        // Get selected plan details
        const selectedPlan = subscriptionPlans.find(plan => plan.id === formData.selectedPlan)
        
        // Proceed to Stripe checkout
        await handleStripeCheckout(selectedPlan)

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
                      ? (isSubmitting ? 'Processing...' : 'Proceed to Payment')
                      : 'Continue'
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TradeSignup
