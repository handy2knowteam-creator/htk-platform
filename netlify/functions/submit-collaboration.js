const { GoogleSpreadsheet } = require('google-spreadsheet')
const nodemailer = require('nodemailer')

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const collaborationData = JSON.parse(event.body)
    
    // Validate required fields
    if (!collaborationData.title || !collaborationData.trades || !collaborationData.contactTrade) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    // Initialize Google Sheets
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID)
    
    // Authenticate with service account
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })

    await doc.loadInfo()

    // Get or create Collaborations sheet
    let collaborationsSheet = doc.sheetsByTitle['Collaborations']
    if (!collaborationsSheet) {
      collaborationsSheet = await doc.addSheet({
        title: 'Collaborations',
        headerValues: [
          'Timestamp',
          'Title',
          'Trades',
          'Location',
          'Description',
          'Contact Trade',
          'Contact Email',
          'Contact Phone',
          'Status',
          'Featured',
          'Rating',
          'Completed Jobs'
        ]
      })
    }

    // Add collaboration data to sheet
    const timestamp = new Date().toISOString()
    await collaborationsSheet.addRow({
      'Timestamp': timestamp,
      'Title': collaborationData.title,
      'Trades': Array.isArray(collaborationData.trades) ? collaborationData.trades.join(', ') : collaborationData.trades,
      'Location': collaborationData.location || '',
      'Description': collaborationData.description || '',
      'Contact Trade': collaborationData.contactTrade,
      'Contact Email': collaborationData.contactEmail || '',
      'Contact Phone': collaborationData.contactPhone || '',
      'Status': 'Pending Review',
      'Featured': 'No',
      'Rating': '0',
      'Completed Jobs': '0'
    })

    // Send notification email to admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      const adminEmailOptions = {
        from: process.env.EMAIL_USER,
        to: 'handy2knowteam@gmail.com',
        subject: 'New Collaboration Submitted - HTK Platform',
        html: `
          <h2>New Trade Collaboration Submitted</h2>
          <p><strong>Title:</strong> ${collaborationData.title}</p>
          <p><strong>Trades Involved:</strong> ${Array.isArray(collaborationData.trades) ? collaborationData.trades.join(', ') : collaborationData.trades}</p>
          <p><strong>Location:</strong> ${collaborationData.location || 'Not specified'}</p>
          <p><strong>Description:</strong> ${collaborationData.description || 'Not provided'}</p>
          <p><strong>Contact Trade:</strong> ${collaborationData.contactTrade}</p>
          <p><strong>Contact Email:</strong> ${collaborationData.contactEmail || 'Not provided'}</p>
          <p><strong>Contact Phone:</strong> ${collaborationData.contactPhone || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${timestamp}</p>
          <p>Please review and approve this collaboration in the admin dashboard.</p>
        `
      }

      await transporter.sendMail(adminEmailOptions)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Collaboration submitted successfully' 
      })
    }

  } catch (error) {
    console.error('Collaboration submission error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to submit collaboration',
        details: error.message 
      })
    }
  }
}
