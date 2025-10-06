import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Search, 
  MapPin, 
  Calendar, 
  PoundSterling, 
  Clock, 
  Filter,
  Star,
  Eye,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Zap,
  Home,
  Wrench,
  Droplets,
  Paintbrush,
  Hammer
} from 'lucide-react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function JobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const jobCategories = [
    { id: 'all', name: 'All Categories', icon: Home },
    { id: 'plumbing', name: 'Plumbing', icon: Droplets },
    { id: 'electrical', name: 'Electrical', icon: Zap },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer },
    { id: 'painting', name: 'Painting & Decorating', icon: Paintbrush },
    { id: 'building', name: 'Building & Construction', icon: Home },
    { id: 'heating', name: 'Heating & Gas', icon: Wrench },
    { id: 'handyman', name: 'General Handyman', icon: Wrench }
  ];

  const budgetRanges = [
    { value: 'all', label: 'All Budgets' },
    { value: '0-250', label: 'Under £250' },
    { value: '250-500', label: '£250 - £500' },
    { value: '500-1000', label: '£500 - £1,000' },
    { value: '1000-2500', label: '£1,000 - £2,500' },
    { value: '2500-5000', label: '£2,500 - £5,000' },
    { value: '5000+', label: '£5,000+' }
  ];

  const urgencyLevels = [
    { value: 'all', label: 'All Urgency', color: 'bg-gray-500' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-orange-500' },
    { value: 'soon', label: 'Soon', color: 'bg-yellow-500' },
    { value: 'flexible', label: 'Flexible', color: 'bg-green-500' }
  ];

  // Mock job data - in production this would come from API
  const mockJobs = [
    {
      id: 'JOB-001',
      title: 'Kitchen Tap Replacement',
      category: 'plumbing',
      description: 'Need to replace a leaky kitchen tap. The current tap is dripping constantly and needs urgent replacement. Access is easy, kitchen is on ground floor.',
      budget: '250-500',
      urgency: 'urgent',
      location: 'SW1A 1AA',
      customerName: 'John Smith',
      postedDate: '2024-10-06',
      quotesCount: 3,
      creditsRequired: 15,
      timeline: 'This week',
      propertyType: 'House'
    },
    {
      id: 'JOB-002',
      title: 'Bathroom Electrical Work',
      category: 'electrical',
      description: 'Installing new bathroom extractor fan and additional lighting. Need qualified electrician with Part P certification. All materials provided.',
      budget: '500-1000',
      urgency: 'soon',
      location: 'M1 1AA',
      customerName: 'Sarah Johnson',
      postedDate: '2024-10-05',
      quotesCount: 1,
      creditsRequired: 25,
      timeline: 'Next two weeks',
      propertyType: 'Flat'
    },
    {
      id: 'JOB-003',
      title: 'Garden Decking Installation',
      category: 'carpentry',
      description: 'Looking for experienced carpenter to build a 4m x 3m decking area in back garden. Ground is level, good access. Materials to be quoted separately.',
      budget: '2500-5000',
      urgency: 'flexible',
      location: 'B1 1AA',
      customerName: 'Mike Wilson',
      postedDate: '2024-10-04',
      quotesCount: 5,
      creditsRequired: 45,
      timeline: 'Within a month',
      propertyType: 'House'
    },
    {
      id: 'JOB-004',
      title: 'Emergency Boiler Repair',
      category: 'heating',
      description: 'Boiler has stopped working completely. No hot water or heating. Need Gas Safe registered engineer urgently. Worcester Bosch combi boiler, 5 years old.',
      budget: '250-500',
      urgency: 'emergency',
      location: 'E1 6AN',
      customerName: 'Emma Davis',
      postedDate: '2024-10-06',
      quotesCount: 0,
      creditsRequired: 20,
      timeline: 'ASAP',
      propertyType: 'Flat'
    },
    {
      id: 'JOB-005',
      title: 'Living Room Painting',
      category: 'painting',
      description: 'Need professional painter to paint living room and hallway. Walls need preparation work. High quality finish required. Paint to be provided by contractor.',
      budget: '1000-2500',
      urgency: 'soon',
      location: 'SW3 2AE',
      customerName: 'David Brown',
      postedDate: '2024-10-03',
      quotesCount: 7,
      creditsRequired: 30,
      timeline: 'Next month',
      propertyType: 'House'
    }
  ];

  useEffect(() => {
    // Simulate loading jobs from API
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter jobs based on search criteria
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    if (selectedBudget !== 'all') {
      filtered = filtered.filter(job => job.budget === selectedBudget);
    }

    if (selectedUrgency !== 'all') {
      filtered = filtered.filter(job => job.urgency === selectedUrgency);
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedCategory, selectedBudget, selectedUrgency, locationFilter]);

  const getUrgencyColor = (urgency) => {
    const urgencyObj = urgencyLevels.find(u => u.value === urgency);
    return urgencyObj ? urgencyObj.color : 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const categoryObj = jobCategories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.icon : Home;
  };

  const handleQuoteJob = (jobId, creditsRequired) => {
    // In production, this would check user credits and redirect to quote form
    alert(`This would cost ${creditsRequired} credits to quote. Redirecting to quote form...`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="htk-bg-primary min-h-screen">
        <HTKNavigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-htk-gold mx-auto mb-4"></div>
            <p className="text-htk-platinum">Loading available jobs...</p>
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
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold htk-gold-text mb-4">Available Jobs</h1>
            <p className="text-htk-platinum/80 text-lg">
              Find and quote on jobs that match your skills
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="htk-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 w-4 h-4" />
                    <Input
                      placeholder="Search jobs by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="htk-input pl-10"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="lg:w-48">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 w-4 h-4" />
                    <Input
                      placeholder="Location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="htk-input pl-10"
                    />
                  </div>
                </div>

                {/* Filter Toggle */}
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-htk-gold text-sm font-medium mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="htk-input w-full"
                      >
                        {jobCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-htk-gold text-sm font-medium mb-2">Budget</label>
                      <select
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="htk-input w-full"
                      >
                        {budgetRanges.map(range => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-htk-gold text-sm font-medium mb-2">Urgency</label>
                      <select
                        value={selectedUrgency}
                        onChange={(e) => setSelectedUrgency(e.target.value)}
                        className="htk-input w-full"
                      >
                        {urgencyLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-htk-platinum/60">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
            <div className="flex items-center gap-2 text-htk-platinum/60 text-sm">
              <Clock className="w-4 h-4" />
              Updated 5 minutes ago
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <Card className="htk-card">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-htk-platinum/40 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-htk-platinum mb-2">No jobs found</h3>
                  <p className="text-htk-platinum/60">
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => {
                const IconComponent = getCategoryIcon(job.category);
                return (
                  <Card key={job.id} className="htk-card hover:bg-gray-800 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-htk-gold/20 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-htk-gold" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-htk-platinum">{job.title}</h3>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${getUrgencyColor(job.urgency)}`} />
                                  <span className="text-htk-platinum/60 text-sm capitalize">{job.urgency}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-htk-platinum/60 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Posted {formatDate(job.postedDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <PoundSterling className="w-4 h-4" />
                                  £{job.budget.replace('-', ' - £')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.timeline}
                                </div>
                              </div>

                              <p className="text-htk-platinum/80 mb-4 line-clamp-3">
                                {job.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="outline" className="text-htk-gold border-htk-gold">
                                  {jobCategories.find(cat => cat.id === job.category)?.name}
                                </Badge>
                                <Badge variant="outline" className="text-htk-platinum border-gray-600">
                                  {job.propertyType}
                                </Badge>
                                <div className="flex items-center gap-1 text-htk-platinum/60 text-sm">
                                  <MessageCircle className="w-4 h-4" />
                                  {job.quotesCount} quotes
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Panel */}
                        <div className="lg:w-64 flex flex-col justify-between">
                          <div className="text-center mb-4">
                            <div className="text-2xl font-bold text-htk-gold mb-1">
                              {job.creditsRequired} credits
                            </div>
                            <p className="text-htk-platinum/60 text-sm">to quote this job</p>
                          </div>

                          <div className="space-y-3">
                            <Button 
                              onClick={() => handleQuoteJob(job.id, job.creditsRequired)}
                              className="htk-button-primary w-full"
                            >
                              Quote This Job
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              className="w-full flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-htk-platinum/60">Customer:</span>
                              <span className="text-htk-platinum">{job.customerName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Load More */}
          {filteredJobs.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="px-8">
                Load More Jobs
              </Button>
            </div>
          )}
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default JobSearchPage;
