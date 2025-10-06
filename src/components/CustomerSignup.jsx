
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import HTKNavigation from './HTKNavigation'; // Assuming you have a Navigation component
import HTKFooter from './HTKFooter'; // Assuming you have a Footer component

function CustomerSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    jobDescription: "",
    budget: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.postcode) {
        alert("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Submit to Netlify function
      const response = await fetch("/.netlify/functions/submit-customer-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success message and redirect
        alert(`Thank you ${formData.name}! Your job request has been submitted. We'll be in touch within 24 hours.`);
        navigate("/success?type=customer");
      } else {
        throw new Error(result.error || "Submission failed");
      }

    } catch (error) {
      console.error("Customer registration error:", error);
      alert(`Registration failed: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
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
                      placeholder="your.email@domain.com"
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
                    {isSubmitting ? "Submitting..." : "Submit Job Request"}
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
      <HTKFooter />
    </div>
  );
}

export default CustomerSignup;

