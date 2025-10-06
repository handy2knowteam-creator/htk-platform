import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Eye, EyeOff, Shield, Mail, Phone, Calendar, MapPin, User, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function CustomerAuth() {
  const [currentStep, setCurrentStep] = useState(1);
  const [authMode, setAuthMode] = useState('signup'); // 'signup', 'login', 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Address Information
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    
    // Authentication
    password: '',
    confirmPassword: '',
    
    // Job Information
    jobDescription: '',
    budget: '',
    urgency: '',
    
    // Preferences
    marketingConsent: false,
    smsNotifications: true,
    emailNotifications: true
  });

  // Real-time validation
  useEffect(() => {
    validateField('email', formData.email);
    validateField('password', formData.password);
    validateField('phone', formData.phone);
  }, [formData.email, formData.password, formData.phone]);

  const validateField = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
        
      case 'password':
        if (value && value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, and number';
        } else {
          delete errors.password;
        }
        break;
        
      case 'phone':
        const phoneRegex = /^(\+44|0)[0-9]{10}$/;
        if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
          errors.phone = 'Please enter a valid UK phone number';
        } else {
          delete errors.phone;
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (type !== 'checkbox') {
      validateField(name, value);
    }
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: e.target.value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        // Handle login
        const response = await fetch('/.netlify/functions/customer-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            rememberMe
          })
        });

        const result = await response.json();
        
        if (result.success) {
          if (result.requiresTwoFactor) {
            setTwoFactorEnabled(true);
          } else {
            localStorage.setItem('customerToken', result.token);
            navigate('/customer-dashboard');
          }
        } else {
          throw new Error(result.error);
        }
      } else if (authMode === 'signup') {
        // Handle signup
        const response = await fetch('/.netlify/functions/customer-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
          navigate('/customer-dashboard');
        } else {
          throw new Error(result.error);
        }
      } else if (authMode === 'reset') {
        // Handle password reset
        const response = await fetch('/.netlify/functions/customer-password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Password reset link sent to your email');
          setAuthMode('login');
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTwoFactorVerification = async () => {
    try {
      const response = await fetch('/.netlify/functions/verify-two-factor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('customerToken', result.token);
        navigate('/customer-dashboard');
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      alert('Verification failed');
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-htk-gold text-htk-charcoal' 
                : 'bg-htk-charcoal/20 text-htk-platinum/60'
            }`}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 4 && (
              <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                currentStep > step ? 'bg-htk-gold' : 'bg-htk-charcoal/20'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-htk-platinum/80 text-sm">
          Step {currentStep} of 4: {
            currentStep === 1 ? 'Personal Information' :
            currentStep === 2 ? 'Address & Contact' :
            currentStep === 3 ? 'Security Setup' :
            'Job Requirements'
          }
        </p>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="htk-gold-text flex items-center gap-2">
            <User className="w-4 h-4" />
            First Name *
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="htk-gold-text">
            Last Name *
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="htk-gold-text flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@domain.com"
            className={`htk-input ${validationErrors.email ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.email && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="htk-gold-text flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="07123 456789"
            className={`htk-input ${validationErrors.phone ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.phone && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.phone}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="dateOfBirth" className="htk-gold-text flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleDateChange}
            className="htk-input"
            max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            required
          />
          <p className="text-htk-platinum/60 text-xs mt-1">You must be 18 or older to use our services</p>
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="addressLine1" className="htk-gold-text flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address Line 1 *
        </Label>
        <Input
          id="addressLine1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          placeholder="Enter your street address"
          className="htk-input"
          required
        />
      </div>

      <div>
        <Label htmlFor="addressLine2" className="htk-gold-text">
          Address Line 2
        </Label>
        <Input
          id="addressLine2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          placeholder="Apartment, suite, etc. (optional)"
          className="htk-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="city" className="htk-gold-text">
            City *
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="postcode" className="htk-gold-text">
            Postcode *
          </Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="SW1A 1AA"
            className="htk-input"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySetup = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="password" className="htk-gold-text flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className={`htk-input pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 hover:text-htk-gold transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.password}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="htk-gold-text">
          Confirm Password *
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="htk-input pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 hover:text-htk-gold transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Passwords do not match
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-htk-charcoal/30 text-htk-gold focus:ring-htk-gold"
          />
          <Label htmlFor="rememberMe" className="text-htk-platinum/80 text-sm">
            Remember me on this device
          </Label>
        </div>

        <div className="p-4 bg-htk-charcoal/20 rounded-lg border border-htk-gold/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-htk-gold" />
            <h4 className="font-medium text-htk-gold">Enhanced Security</h4>
          </div>
          <p className="text-htk-platinum/80 text-sm mb-3">
            Enable two-factor authentication for additional account security
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableTwoFactor"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="rounded border-htk-charcoal/30 text-htk-gold focus:ring-htk-gold"
            />
            <Label htmlFor="enableTwoFactor" className="text-htk-platinum/80 text-sm">
              Enable two-factor authentication
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobRequirements = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="jobDescription" className="htk-gold-text">
          Job Description *
        </Label>
        <Textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          placeholder="Describe your project in detail..."
          className="htk-input min-h-[120px]"
          rows={5}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="budget" className="htk-gold-text">
            Budget Range *
          </Label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="htk-input w-full"
            required
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

        <div>
          <Label htmlFor="urgency" className="htk-gold-text">
            Project Urgency
          </Label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="htk-input w-full"
          >
            <option value="">Select urgency</option>
            <option value="ASAP">ASAP (Within 24 hours)</option>
            <option value="This week">This week</option>
            <option value="This month">This month</option>
            <option value="Flexible">Flexible timing</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-htk-gold">Communication Preferences</h4>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="emailNotifications"
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
            className="rounded border-htk-charcoal/30 text-htk-gold focus:ring-htk-gold"
          />
          <Label htmlFor="emailNotifications" className="text-htk-platinum/80 text-sm">
            Email notifications for job updates
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="smsNotifications"
            name="smsNotifications"
            checked={formData.smsNotifications}
            onChange={handleChange}
            className="rounded border-htk-charcoal/30 text-htk-gold focus:ring-htk-gold"
          />
          <Label htmlFor="smsNotifications" className="text-htk-platinum/80 text-sm">
            SMS notifications for urgent updates
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="marketingConsent"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleChange}
            className="rounded border-htk-charcoal/30 text-htk-gold focus:ring-htk-gold"
          />
          <Label htmlFor="marketingConsent" className="text-htk-platinum/80 text-sm">
            I'd like to receive updates about new features and special offers
          </Label>
        </div>
      </div>
    </div>
  );

  if (authMode === 'login') {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text text-center flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!twoFactorEnabled ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="htk-gold-text">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@domain.com"
                        className="htk-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="htk-gold-text">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="htk-input pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 hover:text-htk-gold transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-htk-charcoal/30 text-htk-gold focus:ring-htk-gold"
                        />
                        <Label htmlFor="rememberMe" className="text-htk-platinum/80 text-sm">
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAuthMode('reset')}
                        className="text-htk-gold hover:text-htk-gold/80 text-sm transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="htk-button-primary w-full"
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <p className="text-htk-platinum/80 text-sm">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('signup')}
                          className="text-htk-gold hover:text-htk-gold/80 transition-colors"
                        >
                          Sign up here
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-htk-gold mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-htk-gold mb-2">Two-Factor Authentication</h3>
                      <p className="text-htk-platinum/80 text-sm">
                        Enter the verification code sent to your registered device
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="verificationCode" className="htk-gold-text">Verification Code</Label>
                      <Input
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="htk-input text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </div>

                    <Button 
                      onClick={handleTwoFactorVerification}
                      className="htk-button-primary w-full"
                    >
                      Verify & Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <HTKFooter />
      </div>
    );
  }

  if (authMode === 'reset') {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text text-center flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Reset Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-htk-platinum/80 text-sm">
                      Enter your email address and we'll send you a link to reset your password
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="email" className="htk-gold-text">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@domain.com"
                      className="htk-input"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="htk-button-primary w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-htk-gold hover:text-htk-gold/80 text-sm transition-colors"
                    >
                      Back to login
                    </button>
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

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold htk-gold-text mb-2">Join HTK Premium</h1>
            <p className="text-htk-platinum/80">Create your account and get connected with verified tradespeople</p>
            <Badge variant="outline" className="mt-2 border-htk-gold text-htk-gold">
              Premium Experience
            </Badge>
          </div>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">Customer Registration</CardTitle>
              {renderProgressBar()}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {currentStep === 1 && renderPersonalInfo()}
                {currentStep === 2 && renderAddressInfo()}
                {currentStep === 3 && renderSecuritySetup()}
                {currentStep === 4 && renderJobRequirements()}

                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button 
                      type="button" 
                      onClick={prevStep}
                      variant="outline"
                      className="border-htk-gold text-htk-gold hover:bg-htk-gold hover:text-htk-charcoal"
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 4 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="htk-button-primary"
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="htk-button-primary"
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-center text-sm text-htk-platinum/60 pt-4">
                  <p>Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-htk-gold hover:text-htk-gold/80 transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                  <p className="mt-2">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
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

export default CustomerAuth;
