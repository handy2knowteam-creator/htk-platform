const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { sessionId } = JSON.parse(event.body)

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Session ID is required' })
      }
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment not completed' })
      }
    }

    // Payment was successful, complete the trade registration
    const tradeData = {
      id: session.metadata.tradeId,
      businessName: session.metadata.businessName,
      contactName: session.metadata.contactName,
      email: session.customer_email,
      plan: session.metadata.plan,
      stripeCustomerId: session.customer,
      stripeSessionId: sessionId,
      subscriptionStatus: 'active',
      status: 'active',
      registeredAt: new Date().toISOString(),
      paymentCompletedAt: new Date().toISOString()
    }

    // In a real application, you would save this to a database
    // For now, we'll return the trade data for the frontend to handle
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        trade: tradeData,
        message: 'Trade registration completed successfully'
      })
    }

  } catch (error) {
    console.error('Complete registration error:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to complete registration',
        details: error.message
      })
    }
  }
}
