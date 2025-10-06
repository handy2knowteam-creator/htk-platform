import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Search, MapPin, Star, Phone, Mail, Award, Filter } from 'lucide-react';

function TradesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Mock trade data
  const trades = [
    {
      id: 1,
      businessName: 'Smith Plumbing Ltd',
      contactName: 'Mike Smith',
      email: 'mike@smithplumbing.com',
      phone: '07111222333',
      location: 'London',
      postcode: 'SW1A 1AA',
      tradeType: 'Plumbing',
      services: ['Emergency Plumbing', 'Bathroom Installation', 'Boiler Repair'],
      rating: 4.9,
      reviewCount: 127,
      verified: true,
      description: 'Professional plumbing services with 15+ years experience. Gas Safe registered.',
      certifications: ['Gas Safe', 'City & Guilds'],
      responseTime: '< 2 hours',
      plan: 'Gold'
    },
    {
      id: 2,
      businessName: 'Elite Electrical',
      contactName: 'David Brown',
      email: 'david@eliteelectrical.com',
      phone: '07444555666',
      location: 'Manchester',
      postcode: 'M1 1AA',
      tradeType: 'Electrical',
      services: ['Rewiring', 'Solar Installation', 'EV Charger Installation'],
      rating: 4.8,
      reviewCount: 89,
      verified: true,
      description: 'NICEIC approved electrical contractor specializing in renewable energy solutions.',
      certifications: ['NICEIC', 'Part P'],
      responseTime: '< 4 hours',
      plan: 'Silver'
    },
    {
      id: 3,
      businessName: 'Precision Carpentry',
      contactName: 'James Wilson',
      email: 'james@precisioncarpentry.co.uk',
      phone: '07777888999',
      location: 'Birmingham',
      postcode: 'B1 1AA',
      tradeType: 'Carpentry',
      services: ['Kitchen Fitting', 'Bespoke Furniture', 'Flooring'],
      rating: 4.7,
      reviewCount: 156,
      verified: true,
      description: 'Bespoke carpentry and joinery services. Specializing in high-end kitchen installations.',
      certifications: ['City & Guilds', 'CSCS'],
      responseTime: '< 6 hours',
      plan: 'Bronze'
    },
    {
      id: 4,
      businessName: 'ProBuild Construction',
      contactName: 'Sarah Thompson',
      email: 'sarah@probuild.co.uk',
      phone: '07123987654',
      location: 'Leeds',
      postcode: 'LS1 1AA',
      tradeType: 'Building',
      services: ['Extensions', 'Loft Conversions', 'General Building'],
      rating: 4.6,
      reviewCount: 203,
      verified: true,
      description: 'Full building services from planning to completion. Specializing in home extensions.',
      certifications: ['CITB', 'FMB Member'],
      responseTime: '< 8 hours',
      plan: 'Gold'
    }
  ];

  const tradeTypes = ['all', 'Plumbing', 'Electrical', 'Carpentry', 'Building', 'Heating', 'Roofing'];
  const locations = ['all', 'London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Liverpool'];

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTrade = selectedTrade === 'all' || trade.tradeType === selectedTrade;
    const matchesLocation = selectedLocation === 'all' || trade.location === selectedLocation;
    
    return matchesSearch && matchesTrade && matchesLocation;
  });

  const handleClaimProfile = (tradeName) => {
    alert(`To claim the profile for ${tradeName}, please contact us at handy2knowteam@gmail.com with your business details and verification documents.`);
  };

  return (
    <div className="htk-bg-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold htk-gold-text mb-4">Find Premium Tradespeople</h1>
          <p className="text-xl text-htk-platinum/80">Connect with verified professionals in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-htk-charcoal rounded-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-gold w-5 h-5" />
              <Input
                type="text"
                placeholder="Search trades or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="htk-input pl-10"
              />
            </div>
            <div>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="htk-input w-full"
              >
                {tradeTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Trades' : type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="htk-input w-full"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
            <Button className="htk-button-primary">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-htk-platinum/80">
            Showing {filteredTrades.length} verified tradespeople
          </p>
        </div>

        {/* Trade Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrades.map((trade) => (
            <Card key={trade.id} className="htk-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-xl htk-gold-text">{trade.businessName}</CardTitle>
                    <p className="text-htk-platinum/80">{trade.contactName}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {trade.verified && (
                      <Badge className="htk-badge-gold mb-2">
                        <Award className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className={`${
                      trade.plan === 'Gold' ? 'bg-yellow-600' :
                      trade.plan === 'Silver' ? 'bg-gray-400' : 'bg-amber-600'
                    } text-white`}>
                      {trade.plan}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-htk-platinum ml-1">{trade.rating}</span>
                    <span className="text-htk-platinum/60 ml-1">({trade.reviewCount})</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-htk-gold mr-1" />
                    <span className="text-htk-platinum/80">{trade.location}</span>
                  </div>
                </div>

                <Badge className="bg-htk-gold text-htk-black mb-4">{trade.tradeType}</Badge>
              </CardHeader>

              <CardContent>
                <p className="text-htk-platinum/80 mb-4">{trade.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold htk-gold-text mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {trade.services.map((service, index) => (
                      <Badge key={index} className="bg-htk-charcoal text-htk-platinum text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold htk-gold-text mb-2">Certifications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {trade.certifications.map((cert, index) => (
                      <Badge key={index} className="bg-green-600 text-white text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-htk-platinum/60">Response Time</p>
                    <p className="text-sm text-htk-gold">{trade.responseTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-htk-platinum/60">Postcode</p>
                    <p className="text-sm text-htk-platinum">{trade.postcode}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full htk-button-primary">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact {trade.contactName}
                  </Button>
                  <Button 
                    className="w-full htk-button-secondary"
                    onClick={() => handleClaimProfile(trade.businessName)}
                  >
                    Claim This Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTrades.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold htk-gold-text mb-4">No tradespeople found</h3>
            <p className="text-htk-platinum/80 mb-8">Try adjusting your search criteria or location</p>
            <Button className="htk-button-primary">
              Post Your Job Instead
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-htk-charcoal rounded-lg p-8 mt-16 text-center">
          <h2 className="text-3xl font-bold htk-gold-text mb-4">Are you a tradesperson?</h2>
          <p className="text-htk-platinum/80 mb-6">Join HTK and connect with customers in your area</p>
          <div className="space-x-4">
            <Button className="htk-button-primary">
              Join as Professional Trade
            </Button>
            <Button className="htk-button-secondary">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradesPage;
