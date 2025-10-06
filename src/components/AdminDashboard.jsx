import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  Settings, 
  LogOut, 
  Download, 
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  Plus,
  Save
} from 'lucide-react';
import AdminAuth from './AdminAuth';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [customerData, setCustomerData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [contentData, setContentData] = useState({
    homepage: {
      heroTitle: 'Connecting Local Trades You Can Trust',
      heroSubtitle: 'Find verified tradespeople in your area',
      featuredTrades: []
    },
    pricing: {
      bronze: { price: 29, features: ['Basic listing', 'Limited leads'] },
      silver: { price: 59, features: ['Higher priority', 'More leads'] },
      gold: { price: 99, features: ['Featured placement', 'Priority leads', 'Verification badge'] },
      platinum: { price: 149, features: ['All Gold perks', 'Free lead credits', 'Featured banner'] }
    }
  });

  // Mock data for demonstration
  const mockCustomers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '07123456789', postcode: 'SW1A 1AA', status: 'active', joinDate: '2024-10-05', jobsPosted: 3 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '07987654321', postcode: 'M1 1AA', status: 'active', joinDate: '2024-10-04', jobsPosted: 1 },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', phone: '07555666777', postcode: 'B1 1AA', status: 'suspended', joinDate: '2024-10-03', jobsPosted: 0 }
  ];

  const mockTrades = [
    { id: 1, businessName: 'Smith Plumbing Ltd', contactName: 'Mike Smith', email: 'mike@smithplumbing.com', phone: '07111222333', services: 'Plumbing, Heating', location: 'London', tier: 'Gold', status: 'verified', joinDate: '2024-10-05', rating: 4.8, jobsCompleted: 15 },
    { id: 2, businessName: 'Elite Electrical', contactName: 'David Brown', email: 'david@eliteelectrical.com', phone: '07444555666', services: 'Electrical, Solar', location: 'Manchester', tier: 'Silver', status: 'pending', joinDate: '2024-10-04', rating: 4.6, jobsCompleted: 8 },
    { id: 3, businessName: 'Quick Fix Carpentry', contactName: 'Tom Jones', email: 'tom@quickfix.com', phone: '07777888999', services: 'Carpentry, Joinery', location: 'Birmingham', tier: 'Bronze', status: 'verified', joinDate: '2024-10-03', rating: 4.9, jobsCompleted: 22 }
  ];

  const mockJobs = [
    { id: 1, title: 'Kitchen Renovation', customer: 'John Smith', budget: '£5,000 - £10,000', status: 'active', posted: '2024-10-05', bids: 3 },
    { id: 2, title: 'Bathroom Fitting', customer: 'Sarah Johnson', budget: '£2,500 - £5,000', status: 'completed', posted: '2024-10-04', bids: 5 },
    { id: 3, title: 'Garden Decking', customer: 'Mike Wilson', budget: '£1,000 - £2,500', status: 'cancelled', posted: '2024-10-03', bids: 2 }
  ];

  const mockPayments = [
    { id: 1, type: 'subscription', customer: 'Smith Plumbing Ltd', amount: 99, status: 'completed', date: '2024-10-05', tier: 'Gold' },
    { id: 2, type: 'job_payment', customer: 'Sarah Johnson', amount: 3500, status: 'completed', date: '2024-10-04', description: 'Bathroom Fitting' },
    { id: 3, type: 'subscription', customer: 'Elite Electrical', amount: 59, status: 'pending', date: '2024-10-04', tier: 'Silver' }
  ];

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('htk_admin_token');
    const email = localStorage.getItem('htk_admin_email');
    
    if (token && email === 'handytoknowteam@gmail.com') {
      setIsAuthenticated(true);
      setAdminData({ email, token });
      loadDashboardData();
    }
  }, []);

  const handleAuthSuccess = (admin) => {
    setIsAuthenticated(true);
    setAdminData(admin);
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('htk_admin_token');
    localStorage.removeItem('htk_admin_email');
    setIsAuthenticated(false);
    setAdminData(null);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // For now, use mock data - in production this would load from Google Sheets
      setCustomerData(mockCustomers);
      setTradeData(mockTrades);
      setJobData(mockJobs);
      setPaymentData(mockPayments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (dataType) => {
    let data, filename;
    
    switch (dataType) {
      case 'customers':
        data = customerData;
        filename = 'htk-customers.csv';
        break;
      case 'trades':
        data = tradeData;
        filename = 'htk-trades.csv';
        break;
      case 'jobs':
        data = jobData;
        filename = 'htk-jobs.csv';
        break;
      case 'payments':
        data = paymentData;
        filename = 'htk-payments.csv';
        break;
      default:
        return;
    }

    const csv = convertToCSV(data);
    downloadCSV(csv, filename);
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const updateUserStatus = async (userId, userType, newStatus) => {
    try {
      // In production, this would call a Netlify function
      console.log(`Updating ${userType} ${userId} to status: ${newStatus}`);
      alert(`${userType} status updated to ${newStatus}`);
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const saveContent = async (section, content) => {
    try {
      // In production, this would call a Netlify function to update content
      console.log(`Saving ${section} content:`, content);
      alert('Content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  const filteredCustomers = customerData.filter(customer => 
    (filterStatus === 'all' || customer.status === filterStatus) &&
    (customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     customer.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTrades = tradeData.filter(trade => 
    (filterStatus === 'all' || trade.status === filterStatus) &&
    (trade.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     trade.contactName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = paymentData.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  );

  return (
    <div className="htk-bg-primary min-h-screen">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold htk-gold-text">HTK Admin Dashboard</h1>
              <p className="text-htk-platinum/60">Welcome back, {adminData?.email}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="htk-card">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'customers', label: 'Customers', icon: Users },
                    { id: 'trades', label: 'Tradespeople', icon: Briefcase },
                    { id: 'jobs', label: 'Jobs', icon: Settings },
                    { id: 'payments', label: 'Payments', icon: CreditCard },
                    { id: 'content', label: 'Content Management', icon: Edit },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === id 
                          ? 'bg-htk-gold text-black font-medium' 
                          : 'text-htk-platinum hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="htk-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-htk-platinum/60 text-sm">Total Customers</p>
                          <p className="text-3xl font-bold htk-gold-text">{customerData.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-htk-gold" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="htk-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-htk-platinum/60 text-sm">Active Trades</p>
                          <p className="text-3xl font-bold htk-gold-text">{tradeData.filter(t => t.status === 'verified').length}</p>
                        </div>
                        <Briefcase className="w-8 h-8 text-htk-gold" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="htk-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-htk-platinum/60 text-sm">Total Jobs</p>
                          <p className="text-3xl font-bold htk-gold-text">{jobData.length}</p>
                        </div>
                        <Settings className="w-8 h-8 text-htk-gold" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="htk-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-htk-platinum/60 text-sm">Revenue</p>
                          <p className="text-3xl font-bold htk-gold-text">£{totalRevenue.toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-htk-gold" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="htk-card">
                  <CardHeader>
                    <CardTitle className="htk-gold-text">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: 'customer', action: 'New customer registration', user: 'John Smith', time: '2 hours ago' },
                        { type: 'trade', action: 'Trade verification completed', user: 'Smith Plumbing Ltd', time: '4 hours ago' },
                        { type: 'payment', action: 'Subscription payment received', user: 'Elite Electrical', time: '6 hours ago' },
                        { type: 'job', action: 'New job posted', user: 'Sarah Johnson', time: '8 hours ago' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'customer' ? 'bg-blue-500' :
                            activity.type === 'trade' ? 'bg-green-500' :
                            activity.type === 'payment' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-htk-platinum">{activity.action}</p>
                            <p className="text-htk-platinum/60 text-sm">{activity.user} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold htk-gold-text">Customer Management</h2>
                  <Button onClick={() => exportData('customers')} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="htk-input"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="htk-input w-48"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </div>

                {/* Customers Table */}
                <Card className="htk-card">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="text-left p-4 htk-gold-text">Customer</th>
                            <th className="text-left p-4 htk-gold-text">Contact</th>
                            <th className="text-left p-4 htk-gold-text">Location</th>
                            <th className="text-left p-4 htk-gold-text">Jobs</th>
                            <th className="text-left p-4 htk-gold-text">Status</th>
                            <th className="text-left p-4 htk-gold-text">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-800">
                              <td className="p-4">
                                <div>
                                  <p className="text-htk-platinum font-medium">{customer.name}</p>
                                  <p className="text-htk-platinum/60 text-sm">Joined {customer.joinDate}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="space-y-1">
                                  <p className="text-htk-platinum text-sm flex items-center gap-2">
                                    <Mail className="w-3 h-3" />
                                    {customer.email}
                                  </p>
                                  <p className="text-htk-platinum text-sm flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    {customer.phone}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="text-htk-platinum flex items-center gap-2">
                                  <MapPin className="w-3 h-3" />
                                  {customer.postcode}
                                </p>
                              </td>
                              <td className="p-4">
                                <p className="text-htk-platinum">{customer.jobsPosted}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  customer.status === 'active' ? 'bg-green-900 text-green-300' :
                                  customer.status === 'suspended' ? 'bg-red-900 text-red-300' :
                                  'bg-gray-900 text-gray-300'
                                }`}>
                                  {customer.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {customer.status === 'active' ? (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateUserStatus(customer.id, 'customer', 'suspended')}
                                    >
                                      <XCircle className="w-3 h-3" />
                                    </Button>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateUserStatus(customer.id, 'customer', 'active')}
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content Management Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold htk-gold-text">Content Management</h2>

                {/* Homepage Content */}
                <Card className="htk-card">
                  <CardHeader>
                    <CardTitle className="htk-gold-text">Homepage Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="htk-gold-text">Hero Title</Label>
                      <Input
                        value={contentData.homepage.heroTitle}
                        onChange={(e) => setContentData({
                          ...contentData,
                          homepage: { ...contentData.homepage, heroTitle: e.target.value }
                        })}
                        className="htk-input"
                      />
                    </div>
                    <div>
                      <Label className="htk-gold-text">Hero Subtitle</Label>
                      <Textarea
                        value={contentData.homepage.heroSubtitle}
                        onChange={(e) => setContentData({
                          ...contentData,
                          homepage: { ...contentData.homepage, heroSubtitle: e.target.value }
                        })}
                        className="htk-input"
                      />
                    </div>
                    <Button 
                      onClick={() => saveContent('homepage', contentData.homepage)}
                      className="htk-button-primary"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Homepage Content
                    </Button>
                  </CardContent>
                </Card>

                {/* Pricing Content */}
                <Card className="htk-card">
                  <CardHeader>
                    <CardTitle className="htk-gold-text">Pricing Tiers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(contentData.pricing).map(([tier, data]) => (
                      <div key={tier} className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="htk-gold-text font-medium mb-3 capitalize">{tier} Tier</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="htk-gold-text">Price (£)</Label>
                            <Input
                              type="number"
                              value={data.price}
                              onChange={(e) => setContentData({
                                ...contentData,
                                pricing: {
                                  ...contentData.pricing,
                                  [tier]: { ...data, price: parseInt(e.target.value) }
                                }
                              })}
                              className="htk-input"
                            />
                          </div>
                          <div>
                            <Label className="htk-gold-text">Features (one per line)</Label>
                            <Textarea
                              value={data.features.join('\n')}
                              onChange={(e) => setContentData({
                                ...contentData,
                                pricing: {
                                  ...contentData.pricing,
                                  [tier]: { ...data, features: e.target.value.split('\n').filter(f => f.trim()) }
                                }
                              })}
                              className="htk-input"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      onClick={() => saveContent('pricing', contentData.pricing)}
                      className="htk-button-primary"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Pricing Content
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other tabs placeholder */}
            {['trades', 'jobs', 'payments', 'settings'].includes(activeTab) && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold htk-gold-text">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h2>
                <Card className="htk-card">
                  <CardContent className="p-6">
                    <p className="text-htk-platinum">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management features coming soon...
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
