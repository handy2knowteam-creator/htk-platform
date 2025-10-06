import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Eye, EyeOff, Calendar, Shield, Mail, Phone, MapPin, User, Lock, CheckCircle } from 'lucide-react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';
import FormUnavailable from './FormUnavailable';

function CustomerSignup() {
  // Enable customer signup form to collect data in Google Sheets
  const isBackendAvailable = true; 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    jobDescription: "",
    budget: "",
    rememberMe: false,
    enableTwoFA: false,
    marketingConsent: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1); // Multi-step form
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Weak', color: 'text-red-500' };
      case 2:
      case 3: return { text: 'Medium', color: 'text-yellow-500' };
      case 4:
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: '', color: '' };
    }
  };

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.email && 
           formData.phone && formData.postcode && formData.dateOfBirth;
  };

  const validateStep2 = () => {
    return formData.password && formData.confirmPassword && 
           formData.password === formData.confirmPassword && passwordStrength >= 3;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateStep1() || !validateStep2()) {
        alert("Please complete all required fields correctly");
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        accountType: 'customer',
        registrationDate: new Date().toISOString(),
        source: 'website_signup'
      };

      // Submit to Netlify function
      const response = await fetch("/.netlify/functions/submit-customer-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Welcome ${formData.firstName}! Your account has been created successfully. Please check your email for verification instructions.`);
        navigate("/dashboard/customer");
      } else {
        throw new Error(result.error || "Registration failed");
      }

    } catch (error) {
      console.error("Customer registration error:", error);
      alert(`Registration failed: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login implementation
    alert(`${provider} login will be available soon. Please use email registration for now.`);
  };

  if (!isBackendAvailable) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <FormUnavailable formName="Customer Signup" />
        <HTKFooter />
      </div>
    );
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold htk-gold-text mb-4">Join HTK Today</h1>
            <p className="text-htk-platinum/80 text-lg">Create your premium account and connect with verified tradespeople</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNum ? 'bg-htk-gold text-black' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-htk-gold' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">
                {step === 1 && "Personal Information"}
                {step === 2 && "Account Security"}
                {step === 3 && "Project Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Personal Information */}
                {step === 1 && (
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
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          className="htk-input"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="htk-gold-text flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
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
                          className="htk-input"
                          required
                        />
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
                          className="htk-input"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="postcode" className="htk-gold-text flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Postcode *
                        </Label>
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

                      <div>
                        <Label htmlFor="dateOfBirth" className="htk-gold-text flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date of Birth *
                        </Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="htk-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="button"
                        onClick={handleNextStep}
                        disabled={!validateStep1()}
                        className="htk-button-primary px-8"
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Account Security */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="password" className="htk-gold-text flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            className="htk-input pr-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-htk-gold hover:text-htk-gold/80"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    passwordStrength <= 2 ? 'bg-red-500' : 
                                    passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                />
                              </div>
                              <span className={`text-sm ${getPasswordStrengthText().color}`}>
                                {getPasswordStrengthText().text}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="htk-gold-text flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Confirm Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="htk-input pr-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-htk-gold hover:text-htk-gold/80"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="w-4 h-4 text-htk-gold bg-gray-700 border-gray-600 rounded focus:ring-htk-gold"
                        />
                        <Label htmlFor="rememberMe" className="text-htk-platinum">
                          Remember me on this device
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="enableTwoFA"
                          name="enableTwoFA"
                          checked={formData.enableTwoFA}
                          onChange={handleChange}
                          className="w-4 h-4 text-htk-gold bg-gray-700 border-gray-600 rounded focus:ring-htk-gold"
                        />
                        <Label htmlFor="enableTwoFA" className="text-htk-platinum flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Enable Two-Factor Authentication (Recommended)
                        </Label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        onClick={handlePrevStep}
                        variant="outline"
                        className="px-8"
                      >
                        Previous
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleNextStep}
                        disabled={!validateStep2()}
                        className="htk-button-primary px-8"
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Project Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="jobDescription" className="htk-gold-text">Project Description</Label>
                      <Textarea
                        id="jobDescription"
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        placeholder="Tell us about your project (optional for now, you can add details later)"
                        className="htk-input min-h-[120px]"
                        rows={5}
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget" className="htk-gold-text">Estimated Budget</Label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="htk-input w-full"
                      >
                        <option value="">Select budget range (optional)</option>
                        <option value="Under £500">Under £500</option>
                        <option value="£500 - £1,000">£500 - £1,000</option>
                        <option value="£1,000 - £2,500">£1,000 - £2,500</option>
                        <option value="£2,500 - £5,000">£2,500 - £5,000</option>
                        <option value="£5,000 - £10,000">£5,000 - £10,000</option>
                        <option value="Over £10,000">Over £10,000</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="marketingConsent"
                          name="marketingConsent"
                          checked={formData.marketingConsent}
                          onChange={handleChange}
                          className="w-4 h-4 text-htk-gold bg-gray-700 border-gray-600 rounded focus:ring-htk-gold"
                        />
                        <Label htmlFor="marketingConsent" className="text-htk-platinum">
                          I'd like to receive updates about new features and special offers
                        </Label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        onClick={handlePrevStep}
                        variant="outline"
                        className="px-8"
                      >
                        Previous
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="htk-button-primary px-12"
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Social Login Options */}
                {step === 1 && (
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-htk-platinum">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('Google')}
                        className="w-full"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('Facebook')}
                        className="w-full"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-center text-sm text-htk-platinum/60 mt-6">
                  <p>* Required fields</p>
                  <p>By creating an account, you agree to our <a href="/terms" className="htk-gold-text hover:underline">Terms of Service</a> and <a href="/privacy" className="htk-gold-text hover:underline">Privacy Policy</a></p>
                  <p className="mt-2">Already have an account? <a href="/login" className="htk-gold-text hover:underline">Sign in here</a></p>
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

export default CustomerSignup;
