import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { CheckCircle, Star, CreditCard, Users, ArrowRight, Home } from 'lucide-react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  const type = searchParams.get('type'); // 'customer' or 'trade'
  const plan = searchParams.get('plan');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Verify the session and update user data
    const verifySession = async () => {
      if (sessionId && type === 'trade') {
        try {
          const response = await fetch('/.netlify/functions/verify-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });

          if (response.ok) {
            const data = await response.json();
            setSessionData(data);
          }
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [sessionId, type]);

  const getPlanDetails = (planName) => {
    const plans = {
      bronze: { name: 'Bronze', price: '£9.99', credits: '10 credits', color: 'text-orange-500' },
      silver: { name: 'Silver', price: '£49.99', credits: '70 credits', color: 'text-gray-400' },
      gold: { name: 'Gold', price: '£99.99', credits: '160 credits', color: 'text-yellow-500' }
    };
    return plans[planName?.toLowerCase()] || { name: planName, price: '', credits: '', color: 'text-htk-gold' };
  };

  const planDetails = getPlanDetails(plan);

  if (loading) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-htk-gold mx-auto mb-4"></div>
            <p className="text-htk-platinum">Verifying your registration...</p>
          </div>
        </div>
        <HTKFooter />
      </div>
    );
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold htk-gold-text mb-4">
              {type === 'trade' ? 'Welcome to HTK!' : 'Registration Successful!'}
            </h1>
            <p className="text-xl text-htk-platinum/80">
              {type === 'trade' 
                ? 'Your trade account has been created and your subscription is active'
                : 'Your customer account has been created successfully'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Registration Details */}
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-htk-platinum/60">Account Type</span>
                  <span className="text-htk-platinum font-medium capitalize">{type}</span>
                </div>
                
                {type === 'trade' && plan && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-htk-platinum/60">Subscription Plan</span>
                      <span className={`font-medium ${planDetails.color}`}>{planDetails.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-htk-platinum/60">Monthly Price</span>
                      <span className="text-htk-platinum font-medium">{planDetails.price}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-htk-platinum/60">Monthly Credits</span>
                      <span className="text-htk-gold font-medium">{planDetails.credits}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-htk-platinum/60">Registration Date</span>
                  <span className="text-htk-platinum font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-htk-platinum/60">Status</span>
                  <span className="text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {type === 'trade' ? (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-htk-gold text-black rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="text-htk-platinum font-medium">Complete Your Profile</h4>
                        <p className="text-htk-platinum/60 text-sm">Add photos, detailed services, and verify your credentials</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-htk-gold text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="text-htk-platinum font-medium">Start Bidding on Jobs</h4>
                        <p className="text-htk-platinum/60 text-sm">Browse available jobs and submit competitive quotes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-htk-gold text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="text-htk-platinum font-medium">Build Your Reputation</h4>
                        <p className="text-htk-platinum/60 text-sm">Complete jobs and earn 5-star reviews from customers</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-htk-gold text-black rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="text-htk-platinum font-medium">Post Your First Job</h4>
                        <p className="text-htk-platinum/60 text-sm">Describe your project and get quotes from verified trades</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-htk-gold text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="text-htk-platinum font-medium">Compare Quotes</h4>
                        <p className="text-htk-platinum/60 text-sm">Review proposals and choose the best tradesperson for your job</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-htk-gold text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="text-htk-platinum font-medium">Leave a Review</h4>
                        <p className="text-htk-platinum/60 text-sm">Help other customers by rating your experience</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Email Confirmation Notice */}
          <Card className="htk-card mt-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-htk-platinum font-medium mb-1">Check Your Email</h3>
                  <p className="text-htk-platinum/60 text-sm">
                    We've sent a confirmation email with your account details and next steps. 
                    {type === 'trade' && ' Your subscription receipt is also included.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              onClick={() => navigate(type === 'trade' ? '/dashboard/trade' : '/dashboard/customer')}
              className="htk-button-primary px-8 py-3"
            >
              Go to Dashboard
            </Button>
            
            {type === 'customer' && (
              <Button 
                onClick={() => navigate('/post')}
                className="htk-button-secondary px-8 py-3"
              >
                Post Your First Job
              </Button>
            )}
            
            {type === 'trade' && (
              <Button 
                onClick={() => navigate('/jobs')}
                className="htk-button-secondary px-8 py-3"
              >
                Browse Available Jobs
              </Button>
            )}
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-3 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Support Information */}
          <div className="text-center mt-12 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-htk-gold font-medium mb-2">Need Help Getting Started?</h3>
            <p className="text-htk-platinum/60 text-sm mb-4">
              Our support team is here to help you make the most of your HTK account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="mailto:support@handytoknow.com" className="text-htk-gold hover:text-htk-gold/80">
                Email: support@handytoknow.com
              </a>
              <a href="tel:+441234567890" className="text-htk-gold hover:text-htk-gold/80">
                Phone: +44 123 456 7890
              </a>
              <a href="/help" className="text-htk-gold hover:text-htk-gold/80">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default SuccessPage;
