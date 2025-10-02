import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Users, UserCheck, Briefcase, Star, Download, Trash2 } from 'lucide-react'
import htkStorage from './storage.js'

function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const platformStats = htkStorage.getStats()
    const allUsers = htkStorage.getAllUsers()
    const allJobs = htkStorage.getAllJobs()
    
    setStats(platformStats)
    setUsers(allUsers)
    setJobs(allJobs)
  }

  const exportData = () => {
    const data = {
      users: users,
      jobs: jobs,
      stats: stats,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `htk-platform-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all platform data? This cannot be undone.')) {
      htkStorage.clearAllData()
      loadData()
      alert('All data cleared successfully')
    }
  }

  if (!stats) {
    return <div className="htk-bg-primary min-h-screen flex items-center justify-center">
      <div className="text-htk-gold">Loading admin panel...</div>
    </div>
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold htk-gold-text mb-2">HTK Admin Panel</h1>
          <p className="text-htk-platinum/80">Platform management and user data</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button 
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'htk-button-primary' : 'htk-button-secondary'}
          >
            Overview
          </Button>
          <Button 
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'htk-button-primary' : 'htk-button-secondary'}
          >
            Users ({stats.totalUsers})
          </Button>
          <Button 
            onClick={() => setActiveTab('jobs')}
            className={activeTab === 'jobs' ? 'htk-button-primary' : 'htk-button-secondary'}
          >
            Jobs ({stats.totalJobs})
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="htk-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-htk-gold mr-3" />
                    <div>
                      <div className="text-2xl font-bold htk-gold-text">{stats.totalUsers}</div>
                      <div className="text-htk-platinum/80 text-sm">Total Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="htk-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-htk-gold mr-3" />
                    <div>
                      <div className="text-2xl font-bold htk-gold-text">{stats.totalTradespeople}</div>
                      <div className="text-htk-platinum/80 text-sm">Tradespeople</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="htk-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="w-8 h-8 text-htk-gold mr-3" />
                    <div>
                      <div className="text-2xl font-bold htk-gold-text">{stats.totalCustomers}</div>
                      <div className="text-htk-platinum/80 text-sm">Customers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="htk-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-htk-gold mr-3" />
                    <div>
                      <div className="text-2xl font-bold htk-gold-text">{stats.totalJobs}</div>
                      <div className="text-htk-platinum/80 text-sm">Jobs Posted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Registrations */}
            <Card className="htk-card">
              <CardHeader>
                <CardTitle className="htk-gold-text">Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentRegistrations.map((reg, index) => (
                    <div key={reg.id} className="flex justify-between items-center p-3 bg-htk-charcoal rounded">
                      <div>
                        <div className="font-semibold htk-platinum-text">{reg.name}</div>
                        <div className="text-sm text-htk-platinum/60">{reg.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-htk-gold capitalize">{reg.type}</div>
                        <div className="text-xs text-htk-platinum/60">
                          {new Date(reg.registeredAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <div className="flex space-x-4">
              <Button onClick={exportData} className="htk-button-primary">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={clearAllData} className="bg-red-600 hover:bg-red-700 text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text">All Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-htk-gold/20">
                      <th className="text-left p-3 htk-gold-text">Name</th>
                      <th className="text-left p-3 htk-gold-text">Email</th>
                      <th className="text-left p-3 htk-gold-text">Type</th>
                      <th className="text-left p-3 htk-gold-text">Registered</th>
                      <th className="text-left p-3 htk-gold-text">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-htk-platinum/10">
                        <td className="p-3 htk-platinum-text">{user.name}</td>
                        <td className="p-3 text-htk-platinum/80">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.userType === 'trade' ? 'bg-htk-gold text-black' : 'bg-blue-600 text-white'
                          }`}>
                            {user.userType === 'trade' ? 'Tradesperson' : 'Customer'}
                          </span>
                        </td>
                        <td className="p-3 text-htk-platinum/80">
                          {new Date(user.registeredAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <Card className="htk-card">
            <CardHeader>
              <CardTitle className="htk-gold-text">All Posted Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-htk-platinum/60">
                  No jobs posted yet. Jobs will appear here when customers post them.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 bg-htk-charcoal rounded">
                      <h3 className="font-semibold htk-gold-text mb-2">{job.title}</h3>
                      <p className="text-htk-platinum/80 mb-2">{job.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-htk-gold">Budget: {job.budget}</span>
                        <span className="text-htk-platinum/60">
                          Posted: {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
