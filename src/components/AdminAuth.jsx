import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

function AdminAuth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    resetCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

      // Check if email is the authorized admin email
      if (formData.email.toLowerCase() !== 'handytoknowteam@gmail.com') {
        throw new Error('Unauthorized access. Admin access only.');
      }

      // Submit to Netlify function for admin authentication
      const response = await fetch("/.netlify/functions/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store admin authentication token
        localStorage.setItem('htk_admin_token', result.token);
        localStorage.setItem('htk_admin_email', formData.email);
        
        setMessage({ type: 'success', text: 'Login successful! Loading dashboard...' });
        setTimeout(() => {
          onAuthSuccess(result.admin);
        }, 1500);
      } else {
        throw new Error(result.error || "Login failed");
      }

    } catch (error) {
      console.error("Admin login error:", error);
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

      if (formData.email.toLowerCase() !== 'handytoknowteam@gmail.com') {
        throw new Error('Unauthorized access. Admin access only.');
      }

      // Submit password reset request
      const response = await fetch("/.netlify/functions/admin-password-reset", {
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
      const response = await fetch("/.netlify/functions/admin-password-reset", {
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

  return (
    <div className="htk-bg-primary min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-htk-gold" />
            </div>
            <h1 className="text-3xl font-bold htk-gold-text mb-2">
              HTK Admin Portal
            </h1>
            <p className="text-htk-platinum/80">
              {mode === 'login' && 'Secure access for authorized administrators'}
              {mode === 'forgot' && 'Reset your admin password'}
              {mode === 'reset' && 'Set your new admin password'}
            </p>
          </div>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">
                {mode === 'login' && 'Admin Login'}
                {mode === 'forgot' && 'Password Reset'}
                {mode === 'reset' && 'New Password'}
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
                  <span>{message.text}</span>
                </div>
              )}

              {/* Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="htk-gold-text flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Admin Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="handytoknowteam@gmail.com"
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
                        placeholder="Enter your admin password"
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

                  <div className="flex justify-between items-center">
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
                    {isSubmitting ? "Authenticating..." : "Access Dashboard"}
                  </Button>

                  <div className="text-center text-sm text-htk-platinum/60">
                    <p className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Authorized access only
                    </p>
                  </div>
                </form>
              )}

              {/* Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="htk-gold-text flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Admin Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="handytoknowteam@gmail.com"
                      className="htk-input"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="htk-button-primary w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Code"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-htk-gold hover:text-htk-gold/80 text-sm"
                    >
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
                      className="text-htk-gold hover:text-htk-gold/80 text-sm"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
