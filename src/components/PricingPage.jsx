import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Check, Star, Zap, Crown } from 'lucide-react';

function PricingPage() {
  const handlePurchase = async (priceId, planName) => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          planName: planName,
          successUrl: window.location.origin + 
            (planName.includes("Credits") ? "/success?type=credits&amount=" + planName.split(" ")[0] : "/success?type=subscription&plan=" + planName),
          cancelUrl: window.location.origin + "/pricing"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Payment system temporarily unavailable. Please try again later.');
    }
  };

  const plans = [
    {
      name: 'Bronze',
      price: '£9.99',
      period: '/month',
      credits: '10 credits monthly',
      description: 'Perfect for getting started',
      icon: <Star className="w-8 h-8 text-htk-gold" />,
      priceId: 'price_1S7CpoGFrHVFmHVwrXAQfNij', // Bronze Plan Price ID
      features: [
        '10 job leads per month',
        'Basic profile listing',
        'Email support',
        'Mobile app access',
        'Credits never expire'
      ],
      popular: false,
      buttonText: 'Start Bronze Plan'
    },
    {
      name: 'Silver',
      price: '£49.99',
      period: '/month',
      credits: '70 credits monthly',
      description: 'Most popular for growing businesses',
      icon: <Zap className="w-8 h-8 text-htk-gold" />,
      priceId: 'price_1S7CrMGFrHVFmHVwphKoSgxi', // Silver Plan Price ID
      features: [
        '70 job leads per month',
        'Enhanced profile with photos',
        'Priority customer support',
        'Advanced analytics',
        'Credits never expire',
        'Featured in search results'
      ],
      popular: true,
      buttonText: 'Start Silver Plan'
    },
    {
      name: 'Gold',
      price: '£99.99',
      period: '/month',
      credits: '160 credits monthly',
      description: 'For established trade businesses',
      icon: <Crown className="w-8 h-8 text-htk-gold" />,
      priceId: 'price_1S7D9YGFrHVFmHVw5X1Nim7s', // Gold Plan Price ID
      features: [
        '160 job leads per month',
        'Premium profile with video',
        'Dedicated account manager',
        'Advanced business tools',
        'Credits never expire',
        'Top placement in search',
        'Custom branding options'
      ]
    }
  ];

  const payAsYouGoOptions = [
    { credits: 10, price: '£10', priceId: 'price_1S7DacGFrHVFmHVwHWWU7wBv' }, // Pay-as-you-go 10 Credits Price ID
    { credits: 50, price: '£50', priceId: 'price_1S7DacGFrHVFmHVwHWWU7wBv' }, // Pay-as-you-go 50 Credits Price ID
    { credits: 100, price: '£100', priceId: 'price_1S7DacGFrHVFmHVwHWWU7wBv' } // Pay-as-you-go 100 Credits Price ID
  ];

  return (
    <div className="htk-bg-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold htk-gold-text mb-4">Pricing & Credits</h1>
          <p className="text-xl text-htk-platinum/80 mb-8">Fair pricing. Transparent costs. Credits never expire.</p>
          <div className="inline-flex items-center bg-htk-charcoal rounded-lg p-1">
            <Badge className="htk-badge-gold mr-2">1 Credit = £1</Badge>
            <Badge className="bg-green-600 text-white">No Expiry</Badge>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold htk-gold-text text-center mb-12">Monthly Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className={`htk-card relative ${plan.popular ? 'ring-2 ring-htk-gold' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="htk-badge-gold">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl htk-gold-text">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-htk-platinum">
                    {plan.price}
                    <span className="text-lg font-normal text-htk-platinum/60">{plan.period}</span>
                  </div>
                  <p className="text-htk-gold font-semibold">{plan.credits}</p>
                  <p className="text-htk-platinum/80">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-htk-platinum">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'htk-button-primary' : 'htk-button-secondary'}`}
                    onClick={() => handlePurchase(plan.priceId, plan.name)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pay-as-you-go */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold htk-gold-text text-center mb-12">Pay-as-you-go Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {payAsYouGoOptions.map((option) => (
              <Card key={option.credits} className="htk-card text-center">
                <CardHeader>
                  <CardTitle className="text-2xl htk-gold-text">{option.credits} Credits</CardTitle>
                  <div className="text-3xl font-bold text-htk-platinum">{option.price}</div>
                  <p className="text-htk-platinum/80">One-time purchase</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-htk-platinum">Credits never expire</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-htk-platinum">Use anytime</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full htk-button-secondary"
                    onClick={() => handlePurchase(option.priceId, `${option.credits} Credits`)}
                  >
                    Buy {option.credits} Credits
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How Credits Work */}
        <div className="bg-htk-charcoal rounded-lg p-8">
          <h2 className="text-3xl font-bold htk-gold-text text-center mb-8">How Credits Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-htk-gold text-htk-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="text-lg font-semibold htk-gold-text mb-2">Purchase Credits</h3>
              <p className="text-htk-platinum/80">Choose a subscription or buy credits as needed</p>
            </div>
            <div className="text-center">
              <div className="bg-htk-gold text-htk-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="text-lg font-semibold htk-gold-text mb-2">Receive Job Leads</h3>
              <p className="text-htk-platinum/80">Get notified of relevant jobs in your area</p>
            </div>
            <div className="text-center">
              <div className="bg-htk-gold text-htk-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="text-lg font-semibold htk-gold-text mb-2">Spend Credits</h3>
              <p className="text-htk-platinum/80">Use credits to contact customers (£3-£100 per lead)</p>
            </div>
            <div className="text-center">
              <div className="bg-htk-gold text-htk-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">4</div>
              <h3 className="text-lg font-semibold htk-gold-text mb-2">Win Jobs</h3>
              <p className="text-htk-platinum/80">Keep 100% of your earnings from completed jobs</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold htk-gold-text text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Do credits expire?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-htk-platinum">No! Your credits never expire. Use them whenever you're ready to take on new work.</p>
              </CardContent>
            </Card>
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Are there any additional fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-htk-platinum">No. You keep 100% of what you earn. We only charge for the initial lead access.</p>
              </CardContent>
            </Card>
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Can I change my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-htk-platinum">Yes, you can upgrade or downgrade your subscription at any time from your dashboard.</p>
              </CardContent>
            </Card>
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">How much do job leads cost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-htk-platinum">Small jobs start from £3, larger projects up to £100. You see the cost before purchasing each lead.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
