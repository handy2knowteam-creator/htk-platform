const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const nodemailer = require('nodemailer');

// Initialize Google Sheets API
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'handytoknowteam@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS;

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

function createEmailTransporter() {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

function generateJobId() {
  return 'JOB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
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
    const jobData = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'postcode', 'jobCategory', 'jobDescription', 'budget', 'urgency'];
    const missingFields = requiredFields.filter(field => !jobData[field]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        })
      };
    }

    // Generate unique job ID
    const jobId = generateJobId();

    // Prepare data for Google Sheets
    const sheetData = {
      'Job ID': jobId,
      'Timestamp': new Date().toISOString(),
      'Customer Name': jobData.name,
      'Email': jobData.email,
      'Phone': jobData.phone,
      'Postcode': jobData.postcode,
      'Address': jobData.address || '',
      'Property Type': jobData.propertyType || '',
      'Job Title': jobData.jobTitle,
      'Job Category': jobData.jobCategory,
      'Job Description': jobData.jobDescription,
      'Budget Range': jobData.budget,
      'Budget Type': jobData.budgetType || 'fixed',
      'Urgency': jobData.urgency,
      'Timeline': jobData.timeline || '',
      'Access Requirements': jobData.accessRequirements || '',
      'Materials Provided': jobData.materialsProvided || '',
      'Additional Notes': jobData.additionalNotes || '',
      'Preferred Contact': jobData.preferredContactMethod || 'phone',
      'Available Times': jobData.availableForContact || '',
      'Image Count': jobData.imageCount || 0,
      'Status': 'active',
      'Source': jobData.source || 'website',
      'Quotes Received': 0,
      'Date Posted': new Date().toLocaleDateString('en-GB')
    };

    // Save to Google Sheets
    try {
      const doc = await initializeSheet();
      
      // Get or create jobs sheet
      let jobsSheet;
      try {
        jobsSheet = doc.sheetsByTitle['Jobs'];
      } catch (error) {
        // Sheet doesn't exist, create it
        jobsSheet = await doc.addSheet({ 
          title: 'Jobs',
          headerValues: Object.keys(sheetData)
        });
      }

      // Add the job data
      await jobsSheet.addRow(sheetData);

    } catch (sheetError) {
      console.error('Google Sheets error:', sheetError);
      // Continue with email sending even if sheets fails
    }

    // Send notification emails
    try {
      const transporter = createEmailTransporter();

      // Email to admin
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
            <h1 style="color: #B9975B; margin: 0; font-size: 28px;">H2K Platform</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0;">New Job Posted</p>
          </div>
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #333; margin-top: 0;">Job Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #B9975B; margin-top: 0;">Job Information</h3>
              <p><strong>Job ID:</strong> ${jobId}</p>
              <p><strong>Title:</strong> ${jobData.jobTitle}</p>
              <p><strong>Category:</strong> ${jobData.jobCategory}</p>
              <p><strong>Budget:</strong> ${jobData.budget}</p>
              <p><strong>Urgency:</strong> ${jobData.urgency}</p>
              <p><strong>Location:</strong> ${jobData.postcode}</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #B9975B; margin-top: 0;">Customer Details</h3>
              <p><strong>Name:</strong> ${jobData.name}</p>
              <p><strong>Email:</strong> ${jobData.email}</p>
              <p><strong>Phone:</strong> ${jobData.phone}</p>
              <p><strong>Preferred Contact:</strong> ${jobData.preferredContactMethod}</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #B9975B; margin-top: 0;">Job Description</h3>
              <p style="white-space: pre-wrap;">${jobData.jobDescription}</p>
              ${jobData.additionalNotes ? `<p><strong>Additional Notes:</strong><br>${jobData.additionalNotes}</p>` : ''}
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Job posted on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}
              </p>
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: EMAIL_USER,
        to: 'handytoknowteam@gmail.com',
        subject: `New Job Posted: ${jobData.jobTitle} (${jobId})`,
        html: adminEmailHtml
      });

      // Confirmation email to customer
      const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
            <h1 style="color: #B9975B; margin: 0; font-size: 28px;">H2K Platform</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0;">Job Posted Successfully</p>
          </div>
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #333; margin-top: 0;">Thank you, ${jobData.name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Your job has been posted successfully and is now visible to verified tradespeople in your area.
            </p>

            <div style="background: #000000; color: #B9975B; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #B9975B;">Your Job ID</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 0; color: #B9975B;">${jobId}</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #B9975B; margin-top: 0;">Job Summary</h3>
              <p><strong>Title:</strong> ${jobData.jobTitle}</p>
              <p><strong>Category:</strong> ${jobData.jobCategory}</p>
              <p><strong>Budget:</strong> ${jobData.budget}</p>
              <p><strong>Location:</strong> ${jobData.postcode}</p>
            </div>

            <h3 style="color: #B9975B;">What happens next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Verified tradespeople will review your job</li>
              <li>You'll receive quotes directly via email and phone</li>
              <li>Compare quotes and choose the best tradesperson</li>
              <li>Work directly with your chosen trade to complete the job</li>
            </ul>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #2d5a2d; margin: 0; font-weight: bold;">
                💡 Tip: Respond quickly to quotes to secure the best tradespeople!
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Need help? Contact us at <a href="mailto:support@handytoknow.com" style="color: #B9975B;">support@handytoknow.com</a>
                or call <a href="tel:+441234567890" style="color: #B9975B;">+44 123 456 7890</a>
              </p>
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: EMAIL_USER,
        to: jobData.email,
        subject: `Job Posted Successfully - ${jobData.jobTitle} (${jobId})`,
        html: customerEmailHtml
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Job posted successfully',
        jobId: jobId,
        data: {
          jobId,
          title: jobData.jobTitle,
          category: jobData.jobCategory,
          postcode: jobData.postcode,
          status: 'active'
        }
      })
    };

  } catch (error) {
    console.error('Job submission error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to submit job. Please try again later.',
        details: error.message
      })
    };
  }
};
