import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { 
  MapPin, 
  Clock, 
  PoundSterling, 
  User, 
  Calendar,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';

function JobsBoard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Sample job data - in production this would come from your Google Sheets/database
  const sampleJobs = [
    {
      id: 1,
      title: "Kitchen Renovation",
      description: "Complete kitchen renovation including new cabinets, countertops, and appliances. Looking for experienced kitchen fitters.",
      customer: "Sarah Johnson",
      location: "Manchester, M1 1AA",
      budget: "£5,000 - £10,000",
      category: "Carpentry",
      postedDate: "2024-10-06",
      urgency: "Medium",
      creditCost: 15,
      status: "Open",
      requirements: ["Kitchen fitting experience", "Own tools", "Insurance required"]
    },
    {
      id: 2,
      title: "Bathroom Electrical Work",
      description: "Need qualified electrician for bathroom renovation. Installing new lighting, extractor fan, and electric shower.",
      customer: "John Smith",
      location: "London, SW1A 1AA",
      budget: "£1,000 - £2,500",
      category: "Electrical",
      postedDate: "2024-10-05",
      urgency: "High",
      creditCost: 8,
      status: "Open",
      requirements: ["Part P qualified", "NICEIC registered", "Public liability insurance"]
    },
    {
      id: 3,
      title: "Boiler Installation",
      description: "Replace old boiler with new combi boiler. Gas Safe engineer required. Property is a 3-bed house.",
      customer: "Mike Williams",
      location: "Birmingham, B1 1AA",
      budget: "£2,500 - £5,000",
      category: "Plumbing",
      postedDate: "2024-10-04",
      urgency: "High",
      creditCost: 12,
      status: "Open",
      requirements: ["Gas Safe registered", "Boiler installation experience", "Warranty provided"]
    },
    {
      id: 4,
      title: "Garden Decking Project",
      description: "Build new timber decking in back garden. Approximately 4m x 6m area. Materials to be advised.",
      customer: "Emma Davis",
      location: "Leeds, LS1 1AA",
      budget: "£1,000 - £2,500",
      category: "Carpentry",
      postedDate: "2024-10-03",
      urgency: "Low",
      creditCost: 6,
      status: "Open",
      requirements: ["Carpentry experience", "Own tools", "References available"]
    }
  ];

  useEffect(() => {
    // Simulate loading jobs from API/Google Sheets
    setTimeout(() => {
      setJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
      setUserCredits(45); // Sample credit balance
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    if (selectedBudget !== 'all') {
      filtered = filtered.filter(job => job.budget.includes(selectedBudget));
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory, selectedBudget, jobs]);

  const handlePurchaseJob = async (job) => {
    if (userCredits < job.creditCost) {
      alert(`Insufficient credits. You need ${job.creditCost} credits but only have ${userCredits}. Please purchase more credits.`);
      return;
    }

    const confirmed = window.confirm(
      `Purchase this job lead for ${job.creditCost} credits?\n\n` +
      `Job: ${job.title}\n` +
      `Customer: ${job.customer}\n` +
      `Location: ${job.location}\n` +
      `Budget: ${job.budget}\n\n` +
      `You will receive the customer's contact details.`
    );

    if (confirmed) {
      try {
        // In production, this would call your backend to:
        // 1. Deduct credits from user account
        // 2. Mark job as purchased by this tradesperson
        // 3. Send customer contact details
        
        setUserCredits(prev => prev - job.creditCost);
        
        // Show customer contact details
        alert(
          `Job purchased successfully!\n\n` +
          `Customer Contact Details:\n` +
          `Name: ${job.customer}\n` +
          `Phone: 07123 456 789\n` +
          `Email: customer@example.com\n\n` +
          `Please contact the customer within 24 hours.`
        );

        // Update job status
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'Purchased' } : j
        ));

      } catch (error) {
        alert('Error purchasing job. Please try again.');
      }
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-htk-gold mx-auto"></div>
            <p className="text-htk-platinum mt-4">Loading available jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold htk-gold-text mb-2">
                Available Jobs
              </h1>
              <p className="text-htk-platinum/80">
                Purchase job leads with your credits and connect with customers
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center bg-htk-charcoal px-4 py-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-htk-gold mr-2" />
                <span className="text-htk-platinum font-semibold">{userCredits} Credits</span>
              </div>
              <Link to="/pricing">
                <Button className="htk-button-primary">
                  Buy More Credits
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/50 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="htk-input pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="htk-input"
            >
              <option value="all">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Building">Building</option>
              <option value="Heating">Heating</option>
              <option value="Roofing">Roofing</option>
            </select>

            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="htk-input"
            >
              <option value="all">All Budgets</option>
              <option value="Under £500">Under £500</option>
              <option value="£500 - £1,000">£500 - £1,000</option>
              <option value="£1,000 - £2,500">£1,000 - £2,500</option>
              <option value="£2,500 - £5,000">£2,500 - £5,000</option>
              <option value="£5,000 - £10,000">£5,000 - £10,000</option>
              <option value="Over £10,000">Over £10,000</option>
            </select>

            <Button variant="outline" className="htk-button-ghost">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="htk-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="htk-gold-text text-xl mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-htk-platinum/70">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${getUrgencyColor(job.urgency)} text-white`}>
                      {job.urgency} Priority
                    </Badge>
                    <Badge className="htk-badge-gold">
                      {job.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-htk-platinum/90 mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-htk-platinum">
                      <PoundSterling className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-semibold">{job.budget}</span>
                    </div>
                    <div className="flex items-center text-htk-platinum">
                      <User className="w-4 h-4 mr-2 text-htk-gold" />
                      <span>{job.customer}</span>
                    </div>
                  </div>

                  {job.requirements && (
                    <div>
                      <h4 className="text-sm font-semibold text-htk-gold mb-2">Requirements:</h4>
                      <ul className="text-sm text-htk-platinum/80 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1 h-1 bg-htk-gold rounded-full mr-2"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-htk-platinum/20">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-htk-gold" />
                    <span className="text-htk-gold font-semibold">
                      {job.creditCost} Credits
                    </span>
                  </div>
                  
                  {job.status === 'Open' ? (
                    <Button
                      onClick={() => handlePurchaseJob(job)}
                      disabled={userCredits < job.creditCost}
                      className={`${
                        userCredits >= job.creditCost 
                          ? 'htk-button-primary' 
                          : 'htk-button-disabled'
                      }`}
                    >
                      {userCredits >= job.creditCost ? 'Purchase Job' : 'Insufficient Credits'}
                    </Button>
                  ) : (
                    <Badge className="bg-green-600 text-white">
                      Purchased
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-htk-platinum/60 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p>Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
            <Link to="/pricing">
              <Button className="htk-button-primary">
                Upgrade Your Plan for More Jobs
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsBoard;
