import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  MapPin, 
  Calendar, 
  PoundSterling, 
  Clock, 
  Camera, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Home,
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Hammer
} from 'lucide-react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';
import FormUnavailable from './FormUnavailable';

function PostJobPage() {
  // Enable job posting form to collect jobs in Google Sheets
  const isBackendAvailable = true; 

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Customer Details
    name: '',
    email: '',
    phone: '',
    postcode: '',
    address: '',
    
    // Job Details
    jobTitle: '',
    jobCategory: '',
    jobDescription: '',
    urgency: '',
    timeline: '',
    budget: '',
    budgetType: 'fixed', // 'fixed' or 'hourly'
    
    // Additional Info
    propertyType: '',
    accessRequirements: '',
    materialsProvided: '',
    images: [],
    additionalNotes: '',
    
    // Preferences
    preferredContactMethod: 'phone',
    availableForContact: '',
    tradePreferences: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  const jobCategories = [
    { id: 'plumbing', name: 'Plumbing', icon: Droplets, description: 'Pipes, leaks, installations' },
    { id: 'electrical', name: 'Electrical', icon: Zap, description: 'Wiring, lighting, repairs' },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer, description: 'Wood work, furniture, fitting' },
    { id: 'painting', name: 'Painting & Decorating', icon: Paintbrush, description: 'Interior/exterior painting' },
    { id: 'building', name: 'Building & Construction', icon: Home, description: 'Extensions, renovations' },
    { id: 'heating', name: 'Heating & Gas', icon: Wrench, description: 'Boilers, radiators, gas work' },
    { id: 'roofing', name: 'Roofing', icon: Home, description: 'Roof repairs, guttering' },
    { id: 'landscaping', name: 'Landscaping', icon: Home, description: 'Gardens, patios, fencing' },
    { id: 'tiling', name: 'Tiling', icon: Home, description: 'Floor and wall tiling' },
    { id: 'kitchen', name: 'Kitchen Fitting', icon: Home, description: 'Kitchen installation' },
    { id: 'bathroom', name: 'Bathroom Fitting', icon: Home, description: 'Bathroom installation' },
    { id: 'handyman', name: 'General Handyman', icon: Wrench, description: 'Various small jobs' }
  ];

  const budgetRanges = [
    { value: '0-250', label: 'Under £250' },
    { value: '250-500', label: '£250 - £500' },
    { value: '500-1000', label: '£500 - £1,000' },
    { value: '1000-2500', label: '£1,000 - £2,500' },
    { value: '2500-5000', label: '£2,500 - £5,000' },
    { value: '5000-10000', label: '£5,000 - £10,000' },
    { value: '10000+', label: '£10,000+' }
  ];

  const urgencyOptions = [
    { value: 'emergency', label: 'Emergency (ASAP)', color: 'bg-red-500' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', color: 'bg-orange-500' },
    { value: 'soon', label: 'Soon (Within a week)', color: 'bg-yellow-500' },
    { value: 'flexible', label: 'Flexible timing', color: 'bg-green-500' }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const fileArray = Array.from(files);
      setImageFiles(prev => [...prev, ...fileArray]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray.map(file => file.name)]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategorySelect = (categoryId) => {
    const category = jobCategories.find(cat => cat.id === categoryId);
    setFormData(prev => ({
      ...prev,
      jobCategory: categoryId,
      jobTitle: prev.jobTitle || category.name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.phone || !formData.postcode) {
        alert('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      // Validate step 2
      if (!formData.jobCategory || !formData.jobDescription || !formData.budget || !formData.urgency) {
        alert('Please fill in all required fields');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setIsSubmitting(true);

      try {
        // Prepare form data for submission
        const submissionData = {
          ...formData,
          submissionDate: new Date().toISOString(),
          source: 'website_job_post',
          status: 'active',
          imageCount: imageFiles.length
        };

        const response = await fetch('/.netlify/functions/submit-job-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Redirect to success page
          navigate(`/success?type=job&jobId=${result.jobId || 'new'}`);
        } else {
          throw new Error(result.error || 'Failed to submit job');
        }

      } catch (error) {
        console.error('Job submission error:', error);
        alert(`Failed to post job: ${error.message}. Please try again.`);
        setIsSubmitting(false);
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Your Details</h2>
        <p className="text-htk-platinum/80">Tell us about yourself so trades can contact you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="htk-gold-text">Full Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
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
            placeholder="your.email@example.com"
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

        <div className="md:col-span-2">
          <Label htmlFor="address" className="htk-gold-text">Full Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your full address (optional but helps trades find you)"
            className="htk-input"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="propertyType" className="htk-gold-text">Property Type</Label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="htk-input w-full"
          >
            <option value="">Select property type</option>
            <option value="house">House</option>
            <option value="flat">Flat/Apartment</option>
            <option value="bungalow">Bungalow</option>
            <option value="commercial">Commercial Property</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <Label htmlFor="preferredContactMethod" className="htk-gold-text">Preferred Contact Method</Label>
          <select
            id="preferredContactMethod"
            name="preferredContactMethod"
            value={formData.preferredContactMethod}
            onChange={handleChange}
            className="htk-input w-full"
          >
            <option value="phone">Phone Call</option>
            <option value="email">Email</option>
            <option value="text">Text Message</option>
            <option value="any">Any Method</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Job Details</h2>
        <p className="text-htk-platinum/80">Describe your project to attract the right trades</p>
      </div>

      {/* Job Category Selection */}
      <div>
        <Label className="htk-gold-text mb-4 block">What type of work do you need? *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className={`htk-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                  formData.jobCategory === category.id 
                    ? 'ring-2 ring-htk-gold bg-gray-800' 
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="w-8 h-8 text-htk-gold mx-auto mb-2" />
                  <h3 className="text-htk-platinum font-medium mb-1">{category.name}</h3>
                  <p className="text-htk-platinum/60 text-xs">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="jobTitle" className="htk-gold-text">Job Title *</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g., Kitchen tap replacement"
            className="htk-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="urgency" className="htk-gold-text">How urgent is this job? *</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {urgencyOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.urgency === option.value
                    ? 'border-htk-gold bg-gray-800'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={option.value}
                  checked={formData.urgency === option.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-3 h-3 rounded-full ${option.color} mr-3`} />
                <span className="text-htk-platinum">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="jobDescription" className="htk-gold-text">Detailed Description *</Label>
        <Textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          placeholder="Describe your job in detail. Include what needs to be done, any specific requirements, and any relevant background information..."
          className="htk-input"
          rows={6}
          required
        />
        <p className="text-htk-platinum/60 text-sm mt-1">
          The more detail you provide, the better quotes you'll receive
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="budget" className="htk-gold-text">Budget Range *</Label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="htk-input w-full"
            required
          >
            <option value="">Select budget range</option>
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="timeline" className="htk-gold-text">When do you want this completed?</Label>
          <Input
            id="timeline"
            name="timeline"
            type="text"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g., Next week, End of month"
            className="htk-input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold htk-gold-text mb-2">Additional Information</h2>
        <p className="text-htk-platinum/80">Help trades prepare better quotes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="accessRequirements" className="htk-gold-text">Access Requirements</Label>
          <Textarea
            id="accessRequirements"
            name="accessRequirements"
            value={formData.accessRequirements}
            onChange={handleChange}
            placeholder="e.g., Parking available, need to remove shoes, access through back garden..."
            className="htk-input"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="materialsProvided" className="htk-gold-text">Materials & Equipment</Label>
          <Textarea
            id="materialsProvided"
            name="materialsProvided"
            value={formData.materialsProvided}
            onChange={handleChange}
            placeholder="Will you provide materials? Any specific brands or requirements?"
            className="htk-input"
            rows={3}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="images" className="htk-gold-text">Photos (Optional)</Label>
        <Input
          id="images"
          name="images"
          type="file"
          onChange={handleChange}
          accept="image/*"
          multiple
          className="htk-input"
        />
        <p className="text-htk-platinum/60 text-sm mt-1">
          Upload photos to help trades understand the job better
        </p>
        {imageFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-htk-gold text-sm">{imageFiles.length} image(s) selected</p>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="additionalNotes" className="htk-gold-text">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Any other information that might be helpful..."
          className="htk-input"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="availableForContact" className="htk-gold-text">Best times to contact you</Label>
        <Input
          id="availableForContact"
          name="availableForContact"
          type="text"
          value={formData.availableForContact}
          onChange={handleChange}
          placeholder="e.g., Weekdays 9am-5pm, Evenings after 6pm"
          className="htk-input"
        />
      </div>

      {/* Job Summary */}
      <Card className="htk-card bg-gray-800">
        <CardHeader>
          <CardTitle className="htk-gold-text">Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-htk-platinum/60">Category:</span>
            <span className="text-htk-platinum">
              {jobCategories.find(cat => cat.id === formData.jobCategory)?.name || 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-htk-platinum/60">Budget:</span>
            <span className="text-htk-platinum">
              {budgetRanges.find(range => range.value === formData.budget)?.label || 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-htk-platinum/60">Urgency:</span>
            <span className="text-htk-platinum">
              {urgencyOptions.find(opt => opt.value === formData.urgency)?.label || 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-htk-platinum/60">Location:</span>
            <span className="text-htk-platinum">{formData.postcode || 'Not provided'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!isBackendAvailable) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <FormUnavailable formName="Job Posting" />
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
            <h1 className="text-4xl font-bold htk-gold-text mb-4">Post a Job</h1>
            <p className="text-htk-platinum/80 text-lg">
              Get quotes from verified tradespeople in your area
            </p>
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
          </div>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-center">
                {currentStep === 1 && "Your Details"}
                {currentStep === 2 && "Job Details"}
                {currentStep === 3 && "Additional Information"}
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
                      disabled={isSubmitting} 
                      className="htk-button-primary ml-auto px-12"
                    >
                      {isSubmitting ? 'Posting Job...' : 'Post Job'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="htk-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-htk-gold font-medium mb-2">Verified Trades</h3>
                <p className="text-htk-platinum/60 text-sm">
                  All our tradespeople are verified with insurance and qualifications checked
                </p>
              </CardContent>
            </Card>

            <Card className="htk-card">
              <CardContent className="p-6 text-center">
                <PoundSterling className="w-12 h-12 text-htk-gold mx-auto mb-4" />
                <h3 className="text-htk-gold font-medium mb-2">No Upfront Costs</h3>
                <p className="text-htk-platinum/60 text-sm">
                  Posting jobs is free. Only pay when you hire a tradesperson
                </p>
              </CardContent>
            </Card>

            <Card className="htk-card">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-htk-gold font-medium mb-2">Quick Responses</h3>
                <p className="text-htk-platinum/60 text-sm">
                  Get quotes within hours from interested tradespeople
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default PostJobPage;
