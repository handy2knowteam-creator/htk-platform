import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';
import FormUnavailable from './FormUnavailable'; // Import the FormUnavailable component

function TradeSignup() {
  // Enable trade signup form to collect data in Google Sheets
  const isBackendAvailable = true; 

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    servicesOffered: '',
    coverageArea: '',
    insuranceFile: null,
    selectedPlan: '',
    tradeProfession: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
          body: JSON.stringify(formData)
        });

        const tradeResult = await tradeResponse.json();

        if (!tradeResponse.ok || !tradeResult.success) {
          throw new Error(tradeResult.error || 'Failed to save trade registration');
        }

        // Create Stripe price IDs for each plan
        const stripePriceIds = {
          'Silver': import.meta.env.VITE_STRIPE_SILVER_PRICE_ID || 'price_1QCqGJP123456789silver',
          'Gold': import.meta.env.VITE_STRIPE_GOLD_PRICE_ID || 'price_1QCqGJP123456789gold',
          'Platinum': import.meta.env.VITE_STRIPE_PLATINUM_PRICE_ID || 'price_1QCqGJP123456789platinum'
        };

        const priceId = stripePriceIds[formData.selectedPlan];
        
        if (!priceId) {
          throw new Error('Invalid subscription plan selected');
        }

        // Create Stripe checkout session
        const response = await fetch('/.netlify/functions/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: priceId,
            successUrl: `${window.location.origin}/success?type=trade&plan=${formData.selectedPlan}&session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/trade-signup?step=3`,
            customerEmail: formData.email,
            metadata: {
              tradeId: tradeResult.tradeId,
              businessName: formData.businessName,
              contactName: formData.contactName,
              plan: formData.selectedPlan
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create checkout session');
        }

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QCqGJP123456789_test_key');
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          throw new Error(error.message);
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        alert(`Registration failed: ${error.message}. Please try again or contact support.`);
        setIsSubmitting(false);
      }
    }
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
            placeholder="contact@yourbusiness.com"
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
  );

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
          placeholder="e.g., London, Greater Manchester, South East England"
          className="htk-input"
          required
        />
      </div>

      <div>
        <Label htmlFor="tradeProfession" className="htk-gold-text">Trade Profession *</Label>
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
          <option value="Painter">Painter</option>
          <option value="Decorator">Decorator</option>
          <option value="Roofer">Roofer</option>
          <option value="Landscaper">Landscaper</option>
          <option value="Gardener">Gardener</option>
          <option value="Handyman">Handyman</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <Label htmlFor="insuranceFile" className="htk-gold-text">Public Liability Insurance (Optional)</Label>
        <Input
          id="insuranceFile"
          name="insuranceFile"
          type="file"
          onChange={handleChange}
          className="htk-input file:htk-button-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
        />
        <p className="text-xs text-htk-platinum/60 mt-1">Upload your public liability insurance document (PDF, JPG, PNG)</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Choose Your Plan</h2>
        <p className="text-htk-platinum/80">Select the subscription plan that best suits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`htk-card p-6 flex flex-col justify-between ${formData.selectedPlan === plan.id ? 'border-htk-gold border-2' : ''}`}
          >
            <div>
              <CardTitle className="text-xl font-bold htk-gold-text mb-2 flex items-center justify-between">
                {plan.name}
                {plan.popular && <Badge className="bg-htk-gold text-htk-primary">Popular</Badge>}
              </CardTitle>
              <CardDescription className="text-htk-platinum/80 text-3xl font-bold mb-4">
                {plan.price}<span className="text-base font-normal">{plan.period}</span>
              </CardDescription>
              <ul className="space-y-2 text-htk-platinum/90 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => handlePlanSelect(plan.id)}
              className={`mt-6 w-full ${formData.selectedPlan === plan.id ? 'htk-button-primary' : 'htk-button-secondary'}`}
            >
              {formData.selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
            </Button>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-htk-platinum/60 mt-4">
        <p>By selecting a plan, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );

  if (!isBackendAvailable) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <FormUnavailable formName="Trade Signup" />
        <HTKFooter />
      </div>
    );
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold htk-gold-text mb-2">Join HTK as a Professional Trade</h1>
            <p className="text-htk-platinum/80">Register your business and connect with customers seeking your expertise</p>
          </div>

          <Card className="htk-card">
            <CardHeader>
              <div className="flex justify-center space-x-8 mb-4">
                <div className={`text-center ${currentStep === 1 ? 'htk-gold-text font-bold' : 'text-htk-platinum/60'}`}>
                  1. Business Info
                </div>
                <div className={`text-center ${currentStep === 2 ? 'htk-gold-text font-bold' : 'text-htk-platinum/60'}`}>
                  2. Services
                </div>
                <div className={`text-center ${currentStep === 3 ? 'htk-gold-text font-bold' : 'text-htk-platinum/60'}`}>
                  3. Choose Plan
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="htk-button-secondary">
                      Previous
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button type="submit" className="htk-button-primary ml-auto">
                      Next
                    </Button>
                  )}
                  {currentStep === 3 && (
                    <Button type="submit" disabled={isSubmitting} className="htk-button-primary ml-auto">
                      {isSubmitting ? 'Registering...' : 'Register & Pay'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default TradeSignup;

