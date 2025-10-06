import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { CheckCircle, Star, Shield, Zap, Crown } from 'lucide-react';
import FormUnavailable from './FormUnavailable';
import EmbeddedPaymentForm from './EmbeddedPaymentForm';

function TradeSignup() {
  // Enable trade signup form to collect data in Google Sheets
  const isBackendAvailable = true; 

  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    servicesOffered: '',
    coverageArea: '',
    insuranceFile: null,
    selectedPlan: '',
    tradeProfession: '',
    businessAddress: '',
    website: '',
    yearsExperience: '',
    qualifications: '',
    insuranceProvider: '',
    publicLiabilityAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Updated subscription plans according to HTK model
  const subscriptionPlans = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: '£9.99',
      period: '/month',
      credits: '10 credits monthly',
      icon: Shield,
      features: [
        'Basic profile listing',
        '10 job lead credits per month',
        'Customer messaging',
        'Mobile app access',
        'Email support',
        'Basic verification badge'
      ]
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '£49.99',
      period: '/month',
      credits: '70 credits monthly',
      popular: true,
      icon: Star,
      features: [
        'Enhanced profile with photos',
        '70 job lead credits per month',
        'Priority listing in search',
        'Advanced customer messaging',
        'Mobile app access',
        'Phone support',
        'Verification badge',
        'Basic analytics dashboard'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '£99.99',
      period: '/month',
      credits: '160 credits monthly',
      icon: Crown,
      features: [
        'Premium profile with video',
        '160 job lead credits per month',
        'Top priority listing',
        'Featured placement',
        'Advanced messaging & quotes',
        'Mobile app access',
        'Priority phone support',
        'Premium verification badge',
        'Advanced analytics',
        'Marketing tools',
        'Group buying discounts'
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePlanSelect = (planId) => {
    setFormData({
      ...formData,
      selectedPlan: planId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone) {
        alert('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!formData.servicesOffered || !formData.coverageArea || !formData.tradeProfession) {
        alert("Please fill in all required fields");
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!formData.selectedPlan) {
        alert('Please select a subscription plan');
        return;
      }

      setIsSubmitting(true);

      try {
        // First, submit trade data to Google Sheets and send emails
        const tradeResponse = await fetch('/.netlify/functions/submit-trade-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            registrationDate: new Date().toISOString(),
            source: 'website_signup'
          })
        });

        const tradeResult = await tradeResponse.json();

        if (!tradeResponse.ok || !tradeResult.success) {
          throw new Error(tradeResult.error || 'Failed to save trade registration');
        }

        // Show embedded payment form instead of redirecting to Stripe Checkout
        setShowPaymentForm(true);
        setIsSubmitting(false);
        return;

      } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration failed: ${error.message}. Please try again or contact support.`);
        setIsSubmitting(false);
      }
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // Redirect to success page
    navigate(`/success?type=trade&plan=${formData.selectedPlan}&payment_intent=${paymentIntent.id}`);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}. Please try again or contact support.`);
    setShowPaymentForm(false);
  };

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

        <div className="md:col-span-2">
          <Label htmlFor="businessAddress" className="htk-gold-text">Business Address</Label>
          <Textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Your business address"
            className="htk-input"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="website" className="htk-gold-text">Website (Optional)</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="htk-input"
          />
        </div>

        <div>
          <Label htmlFor="yearsExperience" className="htk-gold-text">Years of Experience</Label>
          <select
            id="yearsExperience"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleSelectChange}
            className="htk-input w-full"
          >
            <option value="">Select experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-20">11-20 years</option>
            <option value="20+">20+ years</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Services & Coverage</h2>
        <p className="text-htk-platinum/80">What services do you offer and where?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="tradeProfession" className="htk-gold-text">Primary Trade *</Label>
          <select
            id="tradeProfession"
            name="tradeProfession"
            value={formData.tradeProfession}
            onChange={handleSelectChange}
            className="htk-input w-full"
            required
          >
            <option value="">Select your trade</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Builder">Builder</option>
            <option value="Painter & Decorator">Painter & Decorator</option>
            <option value="Roofer">Roofer</option>
            <option value="Heating Engineer">Heating Engineer</option>
            <option value="Landscaper">Landscaper</option>
            <option value="Tiler">Tiler</option>
            <option value="Plasterer">Plasterer</option>
            <option value="Kitchen Fitter">Kitchen Fitter</option>
            <option value="Bathroom Fitter">Bathroom Fitter</option>
            <option value="Flooring Specialist">Flooring Specialist</option>
            <option value="Window Fitter">Window Fitter</option>
            <option value="Handyman">Handyman</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <Label htmlFor="coverageArea" className="htk-gold-text">Coverage Area *</Label>
          <Input
            id="coverageArea"
            name="coverageArea"
            type="text"
            value={formData.coverageArea}
            onChange={handleChange}
            placeholder="e.g., London, Birmingham, 20 mile radius"
            className="htk-input"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="servicesOffered" className="htk-gold-text">Services Offered *</Label>
          <Textarea
            id="servicesOffered"
            name="servicesOffered"
            value={formData.servicesOffered}
            onChange={handleChange}
            placeholder="Describe the services you offer in detail..."
            className="htk-input"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="qualifications" className="htk-gold-text">Qualifications & Certifications</Label>
          <Textarea
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="List your qualifications, certifications, and memberships"
            className="htk-input"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="insuranceProvider" className="htk-gold-text">Insurance Provider</Label>
          <Input
            id="insuranceProvider"
            name="insuranceProvider"
            type="text"
            value={formData.insuranceProvider}
            onChange={handleChange}
            placeholder="Your insurance company"
            className="htk-input"
          />
        </div>

        <div>
          <Label htmlFor="publicLiabilityAmount" className="htk-gold-text">Public Liability Cover</Label>
          <select
            id="publicLiabilityAmount"
            name="publicLiabilityAmount"
            value={formData.publicLiabilityAmount}
            onChange={handleSelectChange}
            className="htk-input w-full"
          >
            <option value="">Select coverage amount</option>
            <option value="£1,000,000">£1,000,000</option>
            <option value="£2,000,000">£2,000,000</option>
            <option value="£5,000,000">£5,000,000</option>
            <option value="£10,000,000">£10,000,000</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="insuranceFile" className="htk-gold-text">Insurance Certificate (Optional)</Label>
          <Input
            id="insuranceFile"
            name="insuranceFile"
            type="file"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="htk-input"
          />
          <p className="text-htk-platinum/60 text-sm mt-1">Upload your public liability insurance certificate</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Choose Your Plan</h2>
        <p className="text-htk-platinum/80">Select the subscription that works best for your business</p>
        <p className="text-htk-gold text-sm mt-2">Credits never expire • 1 credit = £1 • Small jobs from £3, large jobs up to £100</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <Card 
              key={plan.id}
              className={`htk-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                formData.selectedPlan === plan.id 
                  ? 'ring-2 ring-htk-gold bg-gray-800' 
                  : 'hover:bg-gray-800'
              } ${plan.popular ? 'relative' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-htk-gold text-black font-bold px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <IconComponent className="w-8 h-8 text-htk-gold" />
                </div>
                <CardTitle className="htk-gold-text text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-htk-platinum">{plan.price}</span>
                  <span className="text-htk-platinum/60">{plan.period}</span>
                </div>
                <p className="text-htk-gold text-sm font-medium">{plan.credits}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-htk-platinum text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  type="button"
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full mt-6 ${
                    formData.selectedPlan === plan.id 
                      ? 'htk-button-primary' 
                      : 'htk-button-secondary'
                  }`}
                >
                  {formData.selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-htk-platinum/60 space-y-2">
        <p>• All plans include mobile app access and customer messaging</p>
        <p>• Credits can be topped up anytime at £1 per credit</p>
        <p>• Cancel or change your plan anytime</p>
        <p>By selecting a plan, you agree to our <a href="/terms" className="htk-gold-text hover:underline">Terms of Service</a> and <a href="/privacy" className="htk-gold-text hover:underline">Privacy Policy</a></p>
      </div>
    </div>
  );

  if (!isBackendAvailable) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <FormUnavailable formName="Trade Signup" />
      </div>
    );
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold htk-gold-text mb-4">Join HTK as a Professional Trade</h1>
            <p className="text-htk-platinum/80 text-lg">Register your business and connect with customers seeking your expertise</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= stepNum ? 'bg-htk-gold text-black' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {currentStep > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > stepNum ? 'bg-htk-gold' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          <div className="max-w-4xl mx-auto">
          {!showPaymentForm ? (
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold htk-gold-text text-center">
                  Join Handy 2 Know Today
                  {currentStep === 1 && " - Business Information"}
                  {currentStep === 2 && " - Services & Coverage"}
                  {currentStep === 3 && " - Choose Your Plan"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}

                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => setCurrentStep(currentStep - 1)} 
                        variant="outline"
                        className="px-8"
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < 3 && (
                      <Button 
                        type="submit" 
                        className="htk-button-primary ml-auto px-8"
                      >
                        Next Step
                      </Button>
                    )}
                    {currentStep === 3 && (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.selectedPlan} 
                        className="htk-button-primary ml-auto px-12"
                      >
                        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold htk-gold-text mb-2">Complete Your Subscription</h2>
                <p className="text-htk-platinum/80">
                  You're almost done! Complete your payment to activate your {formData.selectedPlan} plan.
                </p>
              </div>
              
              <EmbeddedPaymentForm
                selectedPlan={formData.selectedPlan}
                formData={formData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              
              <div className="text-center mt-6">
                <Button 
                  type="button" 
                  onClick={() => setShowPaymentForm(false)} 
                  variant="outline"
                  className="px-8"
                >
                  ← Back to Plan Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradeSignup;
