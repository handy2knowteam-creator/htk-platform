const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const sig = event.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    }
  }

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object
        
        // Update trade account status to active
        await handleSuccessfulPayment(session)
        
        // Send welcome email to trade
        await sendTradeWelcomeEmail(session)
        
        break

      case 'invoice.payment_succeeded':
        const invoice = stripeEvent.data.object
        
        // Handle recurring subscription payment
        await handleRecurringPayment(invoice)
        
        break

      case 'invoice.payment_failed':
        const failedInvoice = stripeEvent.data.object
        
        // Handle failed payment
        await handleFailedPayment(failedInvoice)
        
        break

      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object
        
        // Handle subscription cancellation
        await handleSubscriptionCancellation(subscription)
        
        break

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    }

  } catch (error) {
    console.error('Webhook handler error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook handler failed' })
    }
  }
}

async function handleSuccessfulPayment(session) {
  try {
    // In a real app, this would update the database
    // For now, we'll log the successful payment
    console.log('Payment successful for session:', session.id)
    console.log('Customer email:', session.customer_email)
    console.log('Metadata:', session.metadata)

    // Send notification email to admin
    const emailData = {
      to: 'handy2knowteam@gmail.com',
      subject: 'New Trade Subscription Payment - HTK Platform',
      html: `
        <h2>New Trade Subscription Activated</h2>
        <p><strong>Business:</strong> ${session.metadata.businessName}</p>
        <p><strong>Contact:</strong> ${session.metadata.contactName}</p>
        <p><strong>Email:</strong> ${session.customer_email}</p>
        <p><strong>Plan:</strong> ${session.metadata.plan.toUpperCase()}</p>
        <p><strong>Amount:</strong> ${session.amount_total / 100} ${session.currency.toUpperCase()}</p>
        <p><strong>Session ID:</strong> ${session.id}</p>
        <hr>
        <p>Please activate this trade account in the admin panel.</p>
      `
    }

    await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

  } catch (error) {
    console.error('Error handling successful payment:', error)
  }
}

async function sendTradeWelcomeEmail(session) {
  try {
    const emailData = {
      to: session.customer_email,
      subject: 'Welcome to HandyToKnow - Your Subscription is Active!',
      html: `
        <h2>Welcome to HandyToKnow, ${session.metadata.contactName}!</h2>
        <p>Your ${session.metadata.plan.toUpperCase()} subscription is now active.</p>
        
        <h3>What's Next?</h3>
        <ul>
          <li>Complete your profile with photos and portfolio</li>
          <li>Set your service areas and availability</li>
          <li>Start receiving customer leads</li>
          <li>Build your reputation with reviews</li>
        </ul>
        
        <p><strong>Your Account Details:</strong></p>
        <ul>
          <li>Business: ${session.metadata.businessName}</li>
          <li>Plan: ${session.metadata.plan.toUpperCase()}</li>
          <li>Services: ${session.metadata.servicesOffered}</li>
        </ul>
        
        <p>Login to your dashboard to get started: <a href="https://handy2know.com/login">https://handy2know.com/login</a></p>
        
        <p>Need help? Contact us at handy2knowteam@gmail.com</p>
        
        <p>Best regards,<br>The HandyToKnow Team</p>
      `
    }

    await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}

async function handleRecurringPayment(invoice) {
  console.log('Recurring payment successful:', invoice.id)
  // Handle monthly subscription renewal
}

async function handleFailedPayment(invoice) {
  console.log('Payment failed:', invoice.id)
  // Handle failed payment - send notification, suspend account, etc.
}

async function handleSubscriptionCancellation(subscription) {
  console.log('Subscription cancelled:', subscription.id)
  // Handle subscription cancellation - update account status
}
