// Simple client-side storage system for HTK platform
// This stores data in localStorage for demo purposes
// In production, this would be replaced with a proper database

class HTKStorage {
  constructor() {
    this.storageKey = 'htk_platform_data'
    this.initStorage()
  }

  initStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        users: [],
        jobs: [],
        reviews: [],
        leads: [],
        registrations: []
      }
      localStorage.setItem(this.storageKey, JSON.stringify(initialData))
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey))
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // User Registration
  registerUser(userData) {
    const data = this.getData()
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      registeredAt: new Date().toISOString(),
      status: 'active'
    }
    data.users.push(newUser)
    data.registrations.push({
      id: newUser.id,
      type: userData.userType,
      name: userData.name,
      email: userData.email,
      registeredAt: newUser.registeredAt
    })
    this.saveData(data)
    return newUser
  }

  // Get all users
  getAllUsers() {
    return this.getData().users
  }

  // Get all registrations
  getAllRegistrations() {
    return this.getData().registrations
  }

  // Get user by email
  getUserByEmail(email) {
    const data = this.getData()
    return data.users.find(user => user.email === email)
  }

  // Post a job
  postJob(jobData) {
    const data = this.getData()
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedAt: new Date().toISOString(),
      status: 'active'
    }
    data.jobs.push(newJob)
    this.saveData(data)
    return newJob
  }

  // Get all jobs
  getAllJobs() {
    return this.getData().jobs
  }

  // Add review
  addReview(reviewData) {
    const data = this.getData()
    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString()
    }
    data.reviews.push(newReview)
    this.saveData(data)
    return newReview
  }

  // Get reviews for tradesperson
  getReviewsForTradesperson(tradespersonId) {
    const data = this.getData()
    return data.reviews.filter(review => review.tradespersonId === tradespersonId)
  }

  // Get platform statistics
  getStats() {
    const data = this.getData()
    return {
      totalUsers: data.users.length,
      totalCustomers: data.users.filter(u => u.userType === 'customer').length,
      totalTradespeople: data.users.filter(u => u.userType === 'trade').length,
      totalJobs: data.jobs.length,
      totalReviews: data.reviews.length,
      recentRegistrations: data.registrations.slice(-10).reverse()
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(this.storageKey)
    this.initStorage()
  }
}

// Create global instance
const htkStorage = new HTKStorage()
export default htkStorage
