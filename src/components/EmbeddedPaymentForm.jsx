import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QCqGJP123456789_test_key');

const CheckoutForm = ({ selectedPlan, formData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Plan configurations
  const planConfig = {
    bronze: {
      priceId: import.meta.env.VITE_STRIPE_BRONZE_PRICE_ID || 'price_1S7CpoGFrHVFmHVwrXA0fNij',
      amount: 999, // £9.99 in pence
      name: 'Bronze Plan'
    },
    silver: {
      priceId: import.meta.env.VITE_STRIPE_SILVER_PRICE_ID || 'price_1S7CrMGFrHVFmHVwphKoSgxi',
      amount: 4999, // £49.99 in pence
      name: 'Silver Plan'
    },
    gold: {
      priceId: import.meta.env.VITE_STRIPE_GOLD_PRICE_ID || 'price_1S7D9YGFrHVFmHVw5X1Nim7s',
      amount: 9999, // £99.99 in pence
      name: 'Gold Plan'
    }
  };

  // Create payment intent when component mounts
  useEffect(() => {
    if (selectedPlan && planConfig[selectedPlan]) {
      createPaymentIntent();
    }
  }, [selectedPlan]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planConfig[selectedPlan].priceId,
          customerEmail: formData.email,
          customerName: formData.contactName,
          businessName: formData.businessName,
          metadata: {
            businessName: formData.businessName,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            selectedPlan: selectedPlan
          }
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      onError('Failed to initialize payment. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: formData.contactName,
          email: formData.email,
        },
      },
    });

    if (error) {
      console.error('Payment failed:', error);
      onError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);
      onSuccess(paymentIntent);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#E5E4E2',
        backgroundColor: '#222',
        '::placeholder': {
          color: '#888',
        },
        iconColor: '#B9975B',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: false,
  };

  if (!selectedPlan || !planConfig[selectedPlan]) {
    return (
      <div className="text-center py-8">
        <p className="text-htk-platinum/80">Please select a subscription plan to continue.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="htk-card p-6 mb-6">
        <h3 className="text-xl font-bold htk-gold-text mb-4">Complete Your Payment</h3>
        
        {/* Plan Summary */}
        <div className="bg-htk-black/50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-htk-platinum font-medium">{planConfig[selectedPlan].name}</span>
            <span className="text-htk-gold text-lg font-bold">
              £{(planConfig[selectedPlan].amount / 100).toFixed(2)}/month
            </span>
          </div>
          <p className="text-htk-platinum/60 text-sm mt-1">
            Subscription for {formData.businessName}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-htk-gold text-sm font-medium mb-2">
              Card Details
            </label>
            <div className="htk-input p-4">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || isProcessing || !clientSecret}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isProcessing || !stripe || !clientSecret
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'htk-button-primary hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              `Subscribe to ${planConfig[selectedPlan].name} - £${(planConfig[selectedPlan].amount / 100).toFixed(2)}/month`
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-htk-platinum/60">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

const EmbeddedPaymentForm = ({ selectedPlan, formData, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        selectedPlan={selectedPlan}
        formData={formData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default EmbeddedPaymentForm;
