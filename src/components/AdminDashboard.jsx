
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';

function AdminDashboard() {
  const [customerData, setCustomerData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockCustomers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '07123456789', postcode: 'SW1A 1AA', jobDescription: 'Kitchen renovation', budget: '£5,000 - £10,000', date: '2024-10-05' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '07987654321', postcode: 'M1 1AA', jobDescription: 'Bathroom fitting', budget: '£2,500 - £5,000', date: '2024-10-04' }
  ];

  const mockTrades = [
    { id: 1, businessName: 'Smith Plumbing Ltd', contactName: 'Mike Smith', email: 'mike@smithplumbing.com', phone: '07111222333', services: 'Plumbing, Heating', location: 'London', date: '2024-10-05' },
    { id: 2, businessName: 'Elite Electrical', contactName: 'David Brown', email: 'david@eliteelectrical.com', phone: '07444555666', services: 'Electrical, Solar', location: 'Manchester', date: '2024-10-04' }
  ];

  if (loading) {
    return (
      <div className="htk-bg-primary min-h-screen flex items-center justify-center">
        <p className="text-htk-gold text-xl">Loading Admin Dashboard...</p>
      </div>
    );
  }

  const totalCustomers = mockCustomers.length;
  const totalTrades = mockTrades.length;
  const conversionRate = totalCustomers > 0 ? ((totalTrades / totalCustomers) * 100).toFixed(1) : 0;

  return (
    <div className="htk-bg-primary">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold htk-gold-text text-center mb-12">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="htk-card text-center">
            <CardHeader>
              <CardTitle className="text-2xl htk-gold-text">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-htk-platinum">{totalCustomers}</p>
            </CardContent>
          </Card>
          <Card className="htk-card text-center">
            <CardHeader>
              <CardTitle className="text-2xl htk-gold-text">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-htk-platinum">{totalTrades}</p>
            </CardContent>
          </Card>
          <Card className="htk-card text-center">
            <CardHeader>
              <CardTitle className="text-2xl htk-gold-text">Customer to Trade Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-htk-platinum">{conversionRate}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold htk-gold-text mb-6">Recent Customer Registrations</h2>
          <div className="space-y-4">
            {mockCustomers.map((customer) => (
              <Card key={customer.id} className="htk-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="htk-label">Name</Label>
                      <p className="text-htk-platinum">{customer.name}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Email</Label>
                      <p className="text-htk-platinum">{customer.email}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Phone</Label>
                      <p className="text-htk-platinum">{customer.phone}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Postcode</Label>
                      <p className="text-htk-platinum">{customer.postcode}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="htk-label">Job Description</Label>
                      <p className="text-htk-platinum">{customer.jobDescription}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Budget</Label>
                      <p className="text-htk-platinum">{customer.budget}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Date</Label>
                      <p className="text-htk-platinum">{customer.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold htk-gold-text mb-6">Recent Trade Registrations</h2>
          <div className="space-y-4">
            {mockTrades.map((trade) => (
              <Card key={trade.id} className="htk-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="htk-label">Business Name</Label>
                      <p className="text-htk-platinum">{trade.businessName}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Contact Name</Label>
                      <p className="text-htk-platinum">{trade.contactName}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Email</Label>
                      <p className="text-htk-platinum">{trade.email}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Phone</Label>
                      <p className="text-htk-platinum">{trade.phone}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Services</Label>
                      <p className="text-htk-platinum">{trade.services}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Location</Label>
                      <p className="text-htk-platinum">{trade.location}</p>
                    </div>
                    <div>
                      <Label className="htk-label">Date</Label>
                      <p className="text-htk-platinum">{trade.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

