const { GoogleSpreadsheet } = require('google-spreadsheet')
const { JWT } = require('google-auth-library')

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    }
  }

  try {
    // Check for session token (simple validation)
    const authHeader = event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Unauthorized - No valid session' })
      }
    }

    // Initialize Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth)
    await doc.loadInfo()

    const data = {
      customers: [],
      tradespeople: [],
      summary: {
        totalCustomers: 0,
        totalTradespeople: 0,
        newThisWeek: 0,
        pendingPayments: 0
      }
    }

    // Get customers data
    const customersSheet = doc.sheetsByTitle['Customers']
    if (customersSheet) {
      const customerRows = await customersSheet.getRows()
      data.customers = customerRows.map(row => ({
        timestamp: row.get('Timestamp'),
        name: row.get('Name'),
        email: row.get('Email'),
        phone: row.get('Phone'),
        postcode: row.get('Postcode'),
        jobDescription: row.get('Job Description'),
        budget: row.get('Budget'),
        status: row.get('Status')
      }))
      data.summary.totalCustomers = data.customers.length
    }

    // Get tradespeople data
    const tradespeopleSheet = doc.sheetsByTitle['Tradespeople']
    if (tradespeopleSheet) {
      const tradeRows = await tradespeopleSheet.getRows()
      data.tradespeople = tradeRows.map(row => ({
        timestamp: row.get('Timestamp'),
        businessName: row.get('Business Name'),
        contactName: row.get('Contact Name'),
        email: row.get('Email'),
        phone: row.get('Phone'),
        servicesOffered: row.get('Services Offered'),
        coverageArea: row.get('Coverage Area'),
        selectedPlan: row.get('Selected Plan'),
        status: row.get('Status'),
        subscriptionStatus: row.get('Subscription Status')
      }))
      data.summary.totalTradespeople = data.tradespeople.length
      data.summary.pendingPayments = data.tradespeople.filter(t => t.subscriptionStatus === 'Payment Pending').length
    }

    // Calculate new registrations this week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    data.summary.newThisWeek = [
      ...data.customers.filter(c => new Date(c.timestamp) > oneWeekAgo),
      ...data.tradespeople.filter(t => new Date(t.timestamp) > oneWeekAgo)
    ].length

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }

  } catch (error) {
    console.error('Admin data fetch error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch admin data',
        details: error.message 
      })
    }
  }
}
