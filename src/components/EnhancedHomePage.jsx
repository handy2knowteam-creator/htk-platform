import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Star, 
  Shield, 
  Clock, 
  Users, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Hammer,
  Wrench,
  Zap,
  Home,
  Phone,
  Mail
} from 'lucide-react';

function EnhancedHomePage() {
  const stats = [
    { number: '10,000+', label: 'Verified Trades', icon: <Users className="w-6 h-6" /> },
    { number: '50,000+', label: 'Jobs Completed', icon: <CheckCircle className="w-6 h-6" /> },
    { number: '4.9/5', label: 'Average Rating', icon: <Star className="w-6 h-6" /> },
    { number: '< 2hrs', label: 'Response Time', icon: <Clock className="w-6 h-6" /> }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-htk-gold" />,
      title: 'Verified Professionals',
      description: 'All trades are ID verified, DBS checked, and certification validated'
    },
    {
      icon: <Star className="w-8 h-8 text-htk-gold" />,
      title: 'Quality Guaranteed',
      description: 'Every job backed by our quality guarantee and customer protection'
    },
    {
      icon: <Clock className="w-8 h-8 text-htk-gold" />,
      title: 'Fast Response',
      description: 'Get quotes within hours, not days. Most trades respond in under 2 hours'
    },
    {
      icon: <Award className="w-8 h-8 text-htk-gold" />,
      title: 'Premium Service',
      description: 'Only the top-rated, most experienced professionals in your area'
    }
  ];

  const tradeTypes = [
    { name: 'Plumbing', icon: <Wrench className="w-6 h-6" />, count: '2,500+' },
    { name: 'Electrical', icon: <Zap className="w-6 h-6" />, count: '1,800+' },
    { name: 'Building', icon: <Home className="w-6 h-6" />, count: '3,200+' },
    { name: 'Carpentry', icon: <Hammer className="w-6 h-6" />, count: '1,600+' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'London',
      rating: 5,
      text: 'Found an amazing electrician through HTK. Professional, punctual, and reasonably priced. Will definitely use again!'
    },
    {
      name: 'Mike Thompson',
      location: 'Manchester',
      rating: 5,
      text: 'As a plumber, HTK has transformed my business. Quality leads, fair pricing, and no commission fees!'
    },
    {
      name: 'Emma Davis',
      location: 'Birmingham',
      rating: 5,
      text: 'Kitchen renovation was seamless. The carpenter was skilled, tidy, and completed on time and budget.'
    }
  ];

  return (
    <div className="htk-bg-primary">
      {/* Hero Section */}
      <section className="htk-hero relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="htk-animate-fade-in">
            <Badge className="htk-badge-gold mb-6 text-lg px-6 py-2">
              🏆 UK's #1 Premium Trade Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="htk-gradient-text">Premium Trades</span>
              <br />
              <span className="text-htk-platinum">At Your Fingertips</span>
            </h1>
            <p className="text-xl md:text-2xl text-htk-platinum/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with verified, top-rated tradespeople in your area. 
              No commission fees, no hidden costs, just quality work guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/customer-signup">
                <Button className="htk-button-primary text-lg px-8 py-4 w-full sm:w-auto">
                  Find Premium Tradespeople
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/trade-signup">
                <Button className="htk-button-secondary text-lg px-8 py-4 w-full sm:w-auto">
                  Join as Professional Trade
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="htk-animate-slide-in text-center">
                <div className="flex justify-center mb-3 text-htk-gold">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold htk-gold-text mb-2">
                  {stat.number}
                </div>
                <div className="text-htk-platinum/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-htk-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold htk-gold-text mb-6">
              Why Choose HandyToKnow?
            </h2>
            <p className="text-xl text-htk-platinum/80 max-w-3xl mx-auto">
              We've revolutionized how customers and trades connect, creating a premium platform 
              that benefits everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="htk-card text-center p-6">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl htk-gold-text mb-4">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-htk-platinum/80 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trade Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold htk-gold-text mb-6">
              Find Expert Trades
            </h2>
            <p className="text-xl text-htk-platinum/80 max-w-3xl mx-auto">
              From emergency repairs to major renovations, our verified professionals 
              cover every trade you need.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tradeTypes.map((trade, index) => (
              <Link key={index} to="/trades" className="group">
                <Card className="htk-card text-center p-6 group-hover:scale-105 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4 text-htk-gold group-hover:scale-110 transition-transform duration-300">
                      {trade.icon}
                    </div>
                    <h3 className="text-lg font-semibold htk-gold-text mb-2">
                      {trade.name}
                    </h3>
                    <p className="text-htk-platinum/60 text-sm">
                      {trade.count} professionals
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/trades">
              <Button className="htk-button-primary text-lg px-8 py-4">
                View All Trades
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-htk-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold htk-gold-text mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-htk-platinum/80 max-w-3xl mx-auto">
              Join thousands of satisfied customers and successful tradespeople 
              who trust HandyToKnow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="htk-card p-6">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-htk-platinum/80 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-htk-medium-grey pt-4">
                    <p className="font-semibold htk-gold-text">
                      {testimonial.name}
                    </p>
                    <p className="text-htk-platinum/60 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold htk-gold-text mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-htk-platinum/80 mb-8 leading-relaxed">
              Whether you need quality tradespeople or want to grow your trade business, 
              HandyToKnow is your premium platform for success.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <Card className="htk-card p-8">
                <CardHeader>
                  <CardTitle className="text-2xl htk-gold-text mb-4">
                    For Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-htk-platinum">Verified professionals only</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-htk-platinum">Quality guarantee</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-htk-platinum">Fast response times</span>
                    </li>
                  </ul>
                  <Link to="/customer-signup">
                    <Button className="htk-button-primary w-full">
                      Find Tradespeople
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="htk-card p-8">
                <CardHeader>
                  <CardTitle className="text-2xl htk-gold-text mb-4">
                    For Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-htk-platinum">No commission fees</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-htk-platinum">Quality leads only</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-htk-platinum">Credits never expire</span>
                    </li>
                  </ul>
                  <Link to="/trade-signup">
                    <Button className="htk-button-secondary w-full">
                      Join as Professional
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-htk-charcoal">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold htk-gold-text mb-6">
            Questions? We're Here to Help
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href="mailto:handy2knowteam@gmail.com" className="flex items-center text-htk-platinum hover:text-htk-gold transition-colors">
              <Mail className="w-5 h-5 mr-2" />
              handy2knowteam@gmail.com
            </a>
            <a href="tel:+447123456789" className="flex items-center text-htk-platinum hover:text-htk-gold transition-colors">
              <Phone className="w-5 h-5 mr-2" />
              +44 7123 456 789
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnhancedHomePage;
