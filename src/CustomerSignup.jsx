import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'

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

  const sendEmailNotification = async (customerData) => {
    // Email notification to handy2knowteam@gmail.com
    const emailData = {
      to: 'handy2knowteam@gmail.com',
      subject: 'New Customer Sign-Up - HTK Platform',
      html: `
        <h2>New Customer Registration</h2>
        <p><strong>Name:</strong> ${customerData.name}</p>
        <p><strong>Email:</strong> ${customerData.email}</p>
        <p><strong>Phone:</strong> ${customerData.phone}</p>
        <p><strong>Postcode:</strong> ${customerData.postcode}</p>
        <p><strong>Job Description:</strong> ${customerData.jobDescription}</p>
        <p><strong>Budget:</strong> ${customerData.budget}</p>
        <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>Please follow up with this customer within 24 hours.</p>
      `
    }

    try {
      // In production, this would call your email service
      console.log('Email notification sent:', emailData)
      
      // For now, we'll use a simple fetch to a Netlify function
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })
    } catch (error) {
      console.error('Email notification failed:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.postcode) {
        alert('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      // Create customer data object
      const customerData = {
        id: Date.now().toString(),
        ...formData,
        type: 'customer',
        registeredAt: new Date().toISOString(),
        status: 'active'
      }

      // Save to localStorage (admin dashboard)
      const existingCustomers = JSON.parse(localStorage.getItem('htk_customers') || '[]')
      existingCustomers.push(customerData)
      localStorage.setItem('htk_customers', JSON.stringify(existingCustomers))

      // Also save to general users list
      const existingUsers = JSON.parse(localStorage.getItem('htk_users') || '[]')
      existingUsers.push(customerData)
      localStorage.setItem('htk_users', JSON.stringify(existingUsers))

      // Send email notification
      await sendEmailNotification(customerData)

      // Send autoresponder to customer
      const autoresponderData = {
        to: formData.email,
        subject: 'Welcome to HandyToKnow - Your Job Request Received',
        html: `
          <h2>Welcome to HandyToKnow, ${formData.name}!</h2>
          <p>Thank you for submitting your job request. We've received the following details:</p>
          <ul>
            <li><strong>Job:</strong> ${formData.jobDescription}</li>
            <li><strong>Budget:</strong> ${formData.budget}</li>
            <li><strong>Location:</strong> ${formData.postcode}</li>
          </ul>
          <p>Our team will match you with qualified tradespeople in your area within 24 hours.</p>
          <p>You'll receive quotes directly from verified professionals.</p>
          <br>
          <p>Best regards,<br>The HandyToKnow Team</p>
        `
      }

      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(autoresponderData)
      })

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
    </div>
  )
}

export default CustomerSignup
