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
    if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    // Initialize Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const doc = new GoogleSpreadsheet("1-Fkowy9rxfncUIb7DiOd4TzWVcCQ4H7vge849ddQRqs", serviceAccountAuth) // Using the provided GOOGLE_SHEET_ID directly
    await doc.loadInfo()

    // Get or create the "Tradespeople" sheet
    let sheet = doc.sheetsByTitle['Tradespeople']
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: 'Tradespeople',
        headerValues: ['Timestamp', 'Business Name', 'Contact Name', 'Email', 'Phone', 'Services Offered', 'Coverage Area', 'Selected Plan', 'Status', 'Subscription Status']
      })
    }

    // Add the trade data to the sheet
    const timestamp = new Date().toISOString()
    await sheet.addRow({
      'Timestamp': timestamp,
      'Business Name': formData.businessName,
      'Contact Name': formData.contactName,
      'Email': formData.email,
      'Phone': formData.phone,
      'Services Offered': formData.servicesOffered || '',
      'Coverage Area': formData.coverageArea || '',
      'Selected Plan': formData.selectedPlan || 'Not selected',
      'Status': 'New',
      'Subscription Status': formData.selectedPlan ? 'Payment Pending' : 'Registration Only'
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
      <h2>New Tradesperson Registration - HTK Platform</h2>
      <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>Business Name:</strong> ${formData.businessName}</p>
      <p><strong>Contact Name:</strong> ${formData.contactName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Services Offered:</strong> ${formData.servicesOffered || 'Not provided'}</p>
      <p><strong>Coverage Area:</strong> ${formData.coverageArea || 'Not provided'}</p>
      <p><strong>Selected Plan:</strong> ${formData.selectedPlan || 'Not selected'}</p>
      
      <hr>
      <p>This tradesperson has been added to the HTK Tradespeople database.</p>
      ${formData.selectedPlan ? '<p><strong>Note:</strong> Payment processing required for subscription plan.</p>' : '<p>Registration completed without subscription plan.</p>'}
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'handy2knowteam@gmail.com',
      subject: `New Tradesperson Registration: ${formData.businessName}`,
      html: adminEmailHtml
    })

    // Email to tradesperson
    const tradeEmailHtml = `
      <h2>Welcome to HTK - Handy To Know!</h2>
      <p>Dear ${formData.contactName},</p>
      
      <p>Thank you for registering your business <strong>${formData.businessName}</strong> with HTK. We're excited to have you join our community of skilled tradespeople.</p>
      
      <h3>Your Registration Details:</h3>
      <p><strong>Business Name:</strong> ${formData.businessName}</p>
      <p><strong>Services:</strong> ${formData.servicesOffered || 'To be updated'}</p>
      <p><strong>Coverage Area:</strong> ${formData.coverageArea || 'To be updated'}</p>
      ${formData.selectedPlan ? `<p><strong>Selected Plan:</strong> ${formData.selectedPlan}</p>` : ''}
      
      <h3>What happens next?</h3>
      <ul>
        <li>We'll review your registration details</li>
        <li>Verify your credentials and insurance</li>
        ${formData.selectedPlan ? '<li>Complete your subscription payment</li>' : '<li>You can upgrade to a subscription plan anytime</li>'}
        <li>Activate your profile on the platform</li>
        <li>Start receiving job leads from customers</li>
      </ul>
      
      <h3>Platform Benefits:</h3>
      <ul>
        <li>Direct customer connections - no commission fees</li>
        <li>Community profit sharing program</li>
        <li>Professional verification and credibility</li>
        <li>Mobile-optimized platform</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>
      The HTK Team<br>
      <a href="https://handy2know.com">handy2know.com</a></p>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Welcome to HTK - Your Business Registration Received',
      html: tradeEmailHtml
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Tradesperson registration completed successfully',
        tradeId: timestamp,
        requiresPayment: !!formData.selectedPlan
      })
    }

  } catch (error) {
    console.error('Trade form submission error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to process tradesperson registration',
        details: error.message 
      })
    }
  }
}
