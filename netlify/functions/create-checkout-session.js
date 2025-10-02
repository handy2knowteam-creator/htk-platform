const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = JSON.parse(event.body)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: metadata,
      subscription_data: {
        metadata: metadata
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: session.id
      })
    }

  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: error.message
      })
    }
  }
}
