const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Initialize Google Sheets API
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

async function initializeSheet() {
  const serviceAccountAuth = new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Session ID is required' 
        })
      };
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    if (!session) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Session not found' 
        })
      };
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Payment not completed' 
        })
      };
    }

    // Extract metadata
    const metadata = session.metadata || {};
    const subscriptionData = session.subscription;

    // Update trade record with subscription information
    if (metadata.type === 'trade_subscription' && metadata.tradeId) {
      try {
        const doc = await initializeSheet();
        
        // Get or create trades sheet
        let tradesSheet;
        try {
          tradesSheet = doc.sheetsByTitle['Trades'];
        } catch (error) {
          // Sheet doesn't exist, create it
          tradesSheet = await doc.addSheet({ 
            title: 'Trades',
            headerValues: [
              'Timestamp', 'Business Name', 'Contact Name', 'Email', 'Phone',
              'Services Offered', 'Coverage Area', 'Trade Profession', 'Selected Plan',
              'Stripe Customer ID', 'Stripe Subscription ID', 'Subscription Status',
              'Credits Balance', 'Registration Date', 'Last Updated'
            ]
          });
        }

        // Find the trade record and update it
        const rows = await tradesSheet.getRows();
        const tradeRow = rows.find(row => 
          row.get('Email')?.toLowerCase() === session.customer_details?.email?.toLowerCase() ||
          row.get('Business Name') === metadata.businessName
        );

        if (tradeRow) {
          // Update existing record
          tradeRow.set('Stripe Customer ID', session.customer);
          tradeRow.set('Stripe Subscription ID', subscriptionData?.id || '');
          tradeRow.set('Subscription Status', subscriptionData?.status || 'active');
          
          // Set initial credits based on plan
          const planCredits = {
            'bronze': 10,
            'silver': 70,
            'gold': 160
          };
          const credits = planCredits[metadata.plan?.toLowerCase()] || 0;
          tradeRow.set('Credits Balance', credits.toString());
          tradeRow.set('Last Updated', new Date().toISOString());
          
          await tradeRow.save();
        }

        // Log the successful subscription
        console.log('Trade subscription verified:', {
          sessionId,
          customerEmail: session.customer_details?.email,
          plan: metadata.plan,
          subscriptionId: subscriptionData?.id
        });

      } catch (sheetError) {
        console.error('Error updating trade record:', sheetError);
        // Don't fail the verification if sheet update fails
      }
    }

    // Return session verification data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        session: {
          id: session.id,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total,
          currency: session.currency,
          metadata: metadata,
          subscription: subscriptionData ? {
            id: subscriptionData.id,
            status: subscriptionData.status,
            currentPeriodStart: subscriptionData.current_period_start,
            currentPeriodEnd: subscriptionData.current_period_end
          } : null
        }
      })
    };

  } catch (error) {
    console.error('Session verification error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to verify session'
      })
    };
  }
};
