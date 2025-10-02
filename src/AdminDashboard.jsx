import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Users, CreditCard, TrendingUp, Download, Search, Filter, Mail, Phone, MapPin, Calendar, Star, Pound } from 'lucide-react'

function AdminDashboard() {
  const [customers, setCustomers] = useState([])
  const [trades, setTrades] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    totalTrades: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlySignups: 0,
    conversionRate: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load customers
    const customerData = JSON.parse(localStorage.getItem('htk_customers') || '[]')
    setCustomers(customerData)

    // Load trades
    const tradeData = JSON.parse(localStorage.getItem('htk_trades') || '[]')
    setTrades(tradeData)

    // Calculate analytics
    const totalCustomers = customerData.length
    const totalTrades = tradeData.length
    const activeSubscriptions = tradeData.filter(trade => trade.subscriptionStatus === 'active').length
    
    // Calculate monthly signups (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const monthlySignups = [...customerData, ...tradeData].filter(user => 
      new Date(user.registeredAt) > thirtyDaysAgo
    ).length

    // Estimate revenue based on subscription plans
    const revenueEstimate = tradeData.reduce((total, trade) => {
      if (trade.subscriptionStatus === 'active') {
        switch (trade.selectedPlan) {
          case 'bronze': return total + 29
          case 'silver': return total + 49
          case 'gold': return total + 79
          case 'platinum': return total + 129
          default: return total
        }
      }
      return total
    }, 0)

    const conversionRate = totalCustomers > 0 ? ((totalTrades / totalCustomers) * 100).toFixed(1) : 0

    setAnalytics({
      totalCustomers,
      totalTrades,
      totalRevenue: revenueEstimate,
      activeSubscriptions,
      monthlySignups,
      conversionRate
    })
  }

  const exportData = (type) => {
    let data = []
    let filename = ''

    if (type === 'customers') {
      data = customers
      filename = 'htk-customers.json'
    } else if (type === 'trades') {
      data = trades
      filename = 'htk-trades.json'
    } else {
      data = { customers, trades, analytics }
      filename = 'htk-all-data.json'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportCSV = (type) => {
    let data = []
    let headers = []
    let filename = ''

    if (type === 'customers') {
      data = customers
      headers = ['Name', 'Email', 'Phone', 'Postcode', 'Job Description', 'Budget', 'Registered At']
      filename = 'htk-customers.csv'
    } else if (type === 'trades') {
      data = trades
      headers = ['Business Name', 'Contact Name', 'Email', 'Phone', 'Services', 'Coverage Area', 'Plan', 'Status', 'Registered At']
      filename = 'htk-trades.csv'
    }

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (type === 'customers') {
          return [
            `"${item.name || ''}"`,
            `"${item.email || ''}"`,
            `"${item.phone || ''}"`,
            `"${item.postcode || ''}"`,
            `"${item.jobDescription || ''}"`,
            `"${item.budget || ''}"`,
            `"${item.registeredAt || ''}"`
          ].join(',')
        } else {
          return [
            `"${item.businessName || ''}"`,
            `"${item.contactName || ''}"`,
            `"${item.email || ''}"`,
            `"${item.phone || ''}"`,
            `"${item.servicesOffered || ''}"`,
            `"${item.coverageArea || ''}"`,
            `"${item.selectedPlan || ''}"`,
            `"${item.subscriptionStatus || ''}"`,
            `"${item.registeredAt || ''}"`
          ].join(',')
        }
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sendEmail = (email, type) => {
    const subject = type === 'customer' ? 'Follow-up on your HTK job request' : 'Welcome to HTK - Let\'s get you started'
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`
    window.open(mailtoLink)
  }

  const filteredUsers = () => {
    let allUsers = []
    
    if (filterType === 'all' || filterType === 'customers') {
      allUsers = [...allUsers, ...customers.map(c => ({ ...c, userType: 'customer' }))]
    }
    
    if (filterType === 'all' || filterType === 'trades') {
      allUsers = [...allUsers, ...trades.map(t => ({ ...t, userType: 'trade' }))]
    }

    if (searchTerm) {
      allUsers = allUsers.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.contactName && user.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.businessName && user.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return allUsers.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold htk-gold-text mb-2">HTK Admin Dashboard</h1>
          <p className="text-htk-platinum/80">Manage customers, trades, and platform analytics</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Total Trades</CardTitle>
              <Users className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.totalTrades}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Monthly Revenue</CardTitle>
              <Pound className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">£{analytics.totalRevenue}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.activeSubscriptions}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Monthly Signups</CardTitle>
              <TrendingUp className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.monthlySignups}</div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium htk-platinum-text">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-htk-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold htk-gold-text">{analytics.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htk-platinum/60 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="htk-input pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="htk-input"
            >
              <option value="all">All Users</option>
              <option value="customers">Customers Only</option>
              <option value="trades">Trades Only</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => exportCSV('customers')} className="htk-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Customers CSV
            </Button>
            <Button onClick={() => exportCSV('trades')} className="htk-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Trades CSV
            </Button>
            <Button onClick={() => exportData('all')} className="htk-button-primary">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </div>

        {/* User List */}
        <Card className="htk-card">
          <CardHeader>
            <CardTitle className="htk-gold-text">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers().map((user, index) => (
                <div key={index} className="border border-htk-gold/20 rounded-lg p-4 hover:border-htk-gold/40 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold htk-platinum-text">
                          {user.userType === 'customer' ? user.name : user.contactName}
                        </h3>
                        <Badge variant={user.userType === 'customer' ? 'secondary' : 'default'}>
                          {user.userType === 'customer' ? 'Customer' : 'Trade'}
                        </Badge>
                        {user.userType === 'trade' && user.selectedPlan && (
                          <Badge variant="outline" className="text-htk-gold border-htk-gold">
                            {user.selectedPlan.toUpperCase()}
                          </Badge>
                        )}
                        {user.subscriptionStatus && (
                          <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                            {user.subscriptionStatus}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-htk-platinum/80">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                        {user.postcode && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.postcode}
                          </div>
                        )}
                        {user.coverageArea && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.coverageArea}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.registeredAt).toLocaleDateString()}
                        </div>
                      </div>

                      {user.userType === 'customer' && user.jobDescription && (
                        <div className="mt-2 p-2 bg-htk-charcoal/50 rounded text-sm">
                          <strong>Job:</strong> {user.jobDescription}
                          {user.budget && <span className="ml-2"><strong>Budget:</strong> {user.budget}</span>}
                        </div>
                      )}

                      {user.userType === 'trade' && user.servicesOffered && (
                        <div className="mt-2 p-2 bg-htk-charcoal/50 rounded text-sm">
                          <strong>Services:</strong> {user.servicesOffered}
                          {user.businessName && <span className="ml-2"><strong>Business:</strong> {user.businessName}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendEmail(user.email, user.userType)}
                        className="text-htk-gold border-htk-gold hover:bg-htk-gold hover:text-black"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers().length === 0 && (
                <div className="text-center py-8 text-htk-platinum/60">
                  No users found. {searchTerm && 'Try adjusting your search terms.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-htk-platinum/80">Customer to Trade Ratio:</span>
                  <span className="htk-gold-text">
                    {analytics.totalCustomers}:{analytics.totalTrades}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-htk-platinum/80">Avg. Monthly Revenue per Trade:</span>
                  <span className="htk-gold-text">
                    £{analytics.totalTrades > 0 ? Math.round(analytics.totalRevenue / analytics.totalTrades) : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-htk-platinum/80">Growth Rate (30 days):</span>
                  <span className="htk-gold-text">{analytics.monthlySignups} signups</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-lg">Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={loadData} 
                  className="w-full htk-button-secondary"
                >
                  Refresh Data
                </Button>
                <Button 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                      localStorage.removeItem('htk_customers')
                      localStorage.removeItem('htk_trades')
                      localStorage.removeItem('htk_users')
                      loadData()
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text text-lg">System Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-htk-platinum/80">Last Updated:</span>
                  <span className="htk-gold-text">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-htk-platinum/80">Storage:</span>
                  <span className="htk-gold-text">localStorage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-htk-platinum/80">Version:</span>
                  <span className="htk-gold-text">1.0.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
