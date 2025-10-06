const { GoogleSpreadsheet } = require('google-spreadsheet')
const { JWT } = require('google-auth-library')
const nodemailer = require('nodemailer')

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  try {
    const formData = JSON.parse(event.body)
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.postcode) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;


    // Initialize Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth) // Using the GOOGLE_SHEET_ID from environment variables // Using the provided GOOGLE_SHEET_ID directly
    await doc.loadInfo()

    // Get or create the "Customers" sheet
    let sheet = doc.sheetsByTitle['Customers']
    if (!sheet) {
      sheet = await doc.addSheet({ 
        titl        headerValues: [\'Timestamp\', \'Name\', \'Email\', \'Phone\', \'Postcode\', \'Date of Birth\', \'Password\', \'Job Description\', \'Budget\', \'Remember Me\', \'2FA Enabled\', \'Marketing Consent\', \'Status\']
      })
    }

    // Add the customer data to the sheet
    const timestamp = new Date().toISOString()
    await sheet.addRow({
      'Timestamp': timestamp,
      'Name': fullName,
      'Email': formData.email,
      'Phone': formData.phone,
      'Postcode': formData.postcode,
      'Date of Birth': formData.dateOfBirth || '',
      'Password': formData.password, // Note: In a real app, this should be hashed before sending to backend
      'Job Description': formData.jobDescription || '',
      'Budget': formData.budget || '',
      'Remember Me': formData.rememberMe ? 'Yes' : 'No',
      '2FA Enabled': formData.enableTwoFA ? 'Yes' : 'No',
      'Marketing Consent': formData.marketingConsent ? 'Yes' : 'No',
      'Status': 'New'
    })

    // Send email notification
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Email to admin
    const adminEmailHtml = `
      <h2>New Customer Registration - Handy 2 Know Platform</h2>
      <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Postcode:</strong> ${formData.postcode}</p>
      <p><strong>Job Description:</strong> ${formData.jobDescription || 'Not provided'}</p>
      <p><strong>Budget:</strong> ${formData.budget || 'Not specified'}</p>
      
      <hr>
      <p>This customer has been added to the Handy 2 Know Customer database.</p>
      <p>Please follow up within 24 hours.</p>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'handy2knowteam@gmail.com'      subject: `New Customer Registration: ${fullName}`,    html: adminEmailHtml
    })

    // Email to customer
    const customerEmailHtml = `
      <h2>Welcome to Handy 2 Know!</h2>
      <p>Dear ${fullName},</p>
      
      <p>Thank you for submitting your job request. We've received your details and will connect you with verified tradespeople in your area.</p>
      
      <h3>Your Job Details:</h3>
      <p><strong>Location:</strong> ${formData.postcode}</p>
      <p><strong>Job Description:</strong> ${formData.jobDescription || 'To be discussed'}</p>
      <p><strong>Budget:</strong> ${formData.budget || 'To be discussed'}</p>
      
      <h3>What happens next?</h3>
      <ul>
        <li>We'll review your job requirements</li>
        <li>Match you with suitable verified tradespeople</li>
        <li>You'll receive contact details within 24 hours</li>
        <li>Connect directly with trades - no commission fees!</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>
      The Handy 2 Know Team<br>
      <a href="https://handy2know.com">handy2know.com</a></p>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: `Welcome to Handy 2 Know - Your Job Request Received, ${fullName}`, 
      html: customerEmailHtml
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Customer registration completed successfully',
        customerId: timestamp
      })
    }

  } catch (error) {
    console.error('Customer form submission error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to process customer registration',
        details: error.message 
      })
    }
  }
}
