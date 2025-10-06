import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function CustomerAuth() {
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    resetCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      // Submit to Netlify function for authentication
      const response = await fetch("/.netlify/functions/customer-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store authentication token if provided
        if (result.token) {
          localStorage.setItem('htk_customer_token', result.token);
          if (formData.rememberMe) {
            localStorage.setItem('htk_remember_customer', 'true');
          }
        }
        
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          navigate("/dashboard/customer");
        }, 1500);
      } else {
        throw new Error(result.error || "Login failed");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.email) {
        throw new Error('Please enter your email address');
      }

      // Submit password reset request
      const response = await fetch("/.netlify/functions/customer-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          action: 'request'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password reset instructions have been sent to your email address.' 
        });
        setMode('reset');
      } else {
        throw new Error(result.error || "Password reset request failed");
      }

    } catch (error) {
      console.error("Password reset error:", error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.resetCode || !formData.newPassword || !formData.confirmNewPassword) {
        throw new Error('Please fill in all fields');
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Submit password reset
      const response = await fetch("/.netlify/functions/customer-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          resetCode: formData.resetCode,
          newPassword: formData.newPassword,
          action: 'reset'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password reset successful! You can now log in with your new password.' 
        });
        setTimeout(() => {
          setMode('login');
          setFormData({ ...formData, password: '', resetCode: '', newPassword: '', confirmNewPassword: '' });
        }, 2000);
      } else {
        throw new Error(result.error || "Password reset failed");
      }

    } catch (error) {
      console.error("Password reset error:", error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login implementation
    setMessage({ 
      type: 'info', 
      text: `${provider} login will be available soon. Please use email login for now.` 
    });
  };

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold htk-gold-text mb-2">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </h1>
            <p className="text-htk-platinum/80">
              {mode === 'login' && 'Sign in to your HTK account'}
              {mode === 'forgot' && 'Enter your email to receive reset instructions'}
              {mode === 'reset' && 'Enter the code from your email and set a new password'}
            </p>
          </div>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">
                {mode === 'login' && 'Customer Login'}
                {mode === 'forgot' && 'Forgot Password'}
                {mode === 'reset' && 'Reset Password'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Message Display */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-green-900/20 border border-green-500 text-green-400' :
                  message.type === 'error' ? 'bg-red-900/20 border border-red-500 text-red-400' :
                  'bg-blue-900/20 border border-blue-500 text-blue-400'
                }`}>
                  {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="htk-gold-text flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
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
                    <Label htmlFor="password" className="htk-gold-text flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 text-htk-gold bg-gray-700 border-gray-600 rounded focus:ring-htk-gold"
                      />
                      <Label htmlFor="rememberMe" className="text-htk-platinum text-sm">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-htk-gold hover:text-htk-gold/80 text-sm"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="htk-button-primary w-full"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>

                  {/* Social Login */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-htk-platinum">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('Google')}
                        className="w-full"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-htk-platinum/60">
                    <p>Don't have an account? <a href="/customer-signup" className="htk-gold-text hover:underline">Sign up here</a></p>
                  </div>
                </form>
              )}

              {/* Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="htk-gold-text flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
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

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="htk-button-primary w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-htk-gold hover:text-htk-gold/80 text-sm flex items-center gap-2 mx-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </button>
                  </div>
                </form>
              )}

              {/* Password Reset Form */}
              {mode === 'reset' && (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div>
                    <Label htmlFor="resetCode" className="htk-gold-text">
                      Reset Code
                    </Label>
                    <Input
                      id="resetCode"
                      name="resetCode"
                      type="text"
                      value={formData.resetCode}
                      onChange={handleChange}
                      placeholder="Enter the code from your email"
                      className="htk-input"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="htk-gold-text flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        className="htk-input pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-htk-gold hover:text-htk-gold/80"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmNewPassword" className="htk-gold-text">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      className="htk-input"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="htk-button-primary w-full"
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-htk-gold hover:text-htk-gold/80 text-sm flex items-center gap-2 mx-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default CustomerAuth;
