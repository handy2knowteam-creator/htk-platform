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
    const reviewData = JSON.parse(event.body)
    
    // Validate required fields
    if (!reviewData.customerName || !reviewData.tradeName || !reviewData.rating || !reviewData.comment) {
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

    // Get or create Reviews sheet
    let reviewsSheet = doc.sheetsByTitle['Reviews']
    if (!reviewsSheet) {
      reviewsSheet = await doc.addSheet({
        title: 'Reviews',
        headerValues: [
          'Timestamp',
          'Customer Name',
          'Trade Name',
          'Job Type',
          'Rating',
          'Comment',
          'Location',
          'Verified',
          'Status'
        ]
      })
    }

    // Add review data to sheet
    const timestamp = new Date().toISOString()
    await reviewsSheet.addRow({
      'Timestamp': timestamp,
      'Customer Name': reviewData.customerName,
      'Trade Name': reviewData.tradeName,
      'Job Type': reviewData.jobType || '',
      'Rating': reviewData.rating,
      'Comment': reviewData.comment,
      'Location': reviewData.location || '',
      'Verified': 'Pending',
      'Status': 'Active'
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
        subject: 'New Review Submitted - H2K Platform',
        html: `
          <h2>New Review Submitted</h2>
          <p><strong>Customer:</strong> ${reviewData.customerName}</p>
          <p><strong>Trade:</strong> ${reviewData.tradeName}</p>
          <p><strong>Job Type:</strong> ${reviewData.jobType || 'Not specified'}</p>
          <p><strong>Rating:</strong> ${reviewData.rating}/5 stars</p>
          <p><strong>Comment:</strong> ${reviewData.comment}</p>
          <p><strong>Location:</strong> ${reviewData.location || 'Not specified'}</p>
          <p><strong>Submitted:</strong> ${timestamp}</p>
          <p>Please review and verify this submission in the admin dashboard.</p>
        `
      }

      await transporter.sendMail(adminEmailOptions)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Review submitted successfully' 
      })
    }

  } catch (error) {
    console.error('Review submission error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to submit review',
        details: error.message 
      })
    }
  }
}
