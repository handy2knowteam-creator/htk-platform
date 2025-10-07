exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'Present' : 'Missing'
    }

    console.log('Environment check:', envCheck)

    // Try to parse request body
    let requestData
    try {
      requestData = JSON.parse(event.body)
      console.log('Request data parsed successfully:', Object.keys(requestData))
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message)
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        })
      }
    }

    // Try to initialize Stripe
    let stripe
    try {
      stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      console.log('Stripe initialized successfully')
    } catch (stripeError) {
      console.error('Stripe initialization error:', stripeError.message)
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'Stripe initialization failed',
          details: stripeError.message,
          envCheck: envCheck
        })
      }
    }

    // Return success with diagnostic info
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Function is working correctly',
        envCheck: envCheck,
        requestKeys: Object.keys(requestData),
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Unexpected error in function',
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }
  }
}
