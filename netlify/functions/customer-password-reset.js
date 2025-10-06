const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate reset code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Initialize email transporter
function createEmailTransporter() {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'handytoknowteam@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
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
    const { email, action, resetCode, newPassword } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Email is required' 
        })
      };
    }

    // Initialize Google Sheets
    const doc = await initializeSheet();
    
    // Get customers sheet
    let customersSheet;
    try {
      customersSheet = doc.sheetsByTitle['Customers'];
    } catch (error) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Customer database not found' 
        })
      };
    }

    // Load existing data
    const rows = await customersSheet.getRows();
    
    // Find user by email
    const userRow = rows.find(row => row.get('Email')?.toLowerCase() === email.toLowerCase());
    
    if (!userRow) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'No account found with this email address' 
        })
      };
    }

    if (action === 'request') {
      // Generate reset code
      const code = generateResetCode();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Get or create password reset sheet
      let resetSheet;
      try {
        resetSheet = doc.sheetsByTitle['Password Resets'];
      } catch (error) {
        resetSheet = await doc.addSheet({ 
          title: 'Password Resets',
          headerValues: ['Email', 'Reset Code', 'Expires At', 'Used', 'Created At']
        });
      }

      // Add reset code
      await resetSheet.addRow({
        'Email': email,
        'Reset Code': code,
        'Expires At': expiresAt.toISOString(),
        'Used': 'FALSE',
        'Created At': new Date().toISOString()
      });

      // Send reset email
      try {
        const transporter = createEmailTransporter();
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'handytoknowteam@gmail.com',
          to: email,
          subject: 'HTK - Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
              <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
                <h1 style="color: #B9975B; margin: 0; font-size: 28px;">HTK Platform</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0;">Password Reset Request</p>
              </div>
              <div style="padding: 30px; background: #ffffff;">
                <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                <p style="color: #666; line-height: 1.6;">
                  We received a request to reset your password for your HTK account. 
                  Use the code below to reset your password:
                </p>
                <div style="background: #000000; color: #B9975B; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 3px; margin: 30px 0; border-radius: 8px;">
                  ${code}
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                  This code will expire in 30 minutes for security reasons.
                </p>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                  If you didn't request this password reset, please ignore this email. 
                  Your password will remain unchanged.
                </p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    This is an automated message from HTK Platform. Please do not reply to this email.
                  </p>
                </div>
              </div>
            </div>
          `
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Password reset instructions have been sent to your email address.'
          })
        };

      } catch (emailError) {
        console.error('Email sending error:', emailError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Failed to send reset email. Please try again later.'
          })
        };
      }

    } else if (action === 'reset') {
      if (!resetCode || !newPassword) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Reset code and new password are required' 
          })
        };
      }

      // Get password reset sheet
      let resetSheet;
      try {
        resetSheet = doc.sheetsByTitle['Password Resets'];
      } catch (error) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Invalid reset code' 
          })
        };
      }

      // Find valid reset code
      const resetRows = await resetSheet.getRows();
      const resetRow = resetRows.find(row => 
        row.get('Email')?.toLowerCase() === email.toLowerCase() &&
        row.get('Reset Code') === resetCode &&
        row.get('Used') === 'FALSE' &&
        new Date(row.get('Expires At')) > new Date()
      );

      if (!resetRow) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Invalid or expired reset code' 
          })
        };
      }

      // Validate new password
      if (newPassword.length < 8) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Password must be at least 8 characters long' 
          })
        };
      }

      // Update password
      const hashedPassword = hashPassword(newPassword);
      userRow.set('Password Hash', hashedPassword);
      await userRow.save();

      // Mark reset code as used
      resetRow.set('Used', 'TRUE');
      await resetRow.save();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Password reset successful. You can now log in with your new password.'
        })
      };

    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid action' 
        })
      };
    }

  } catch (error) {
    console.error('Password reset error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Password reset failed. Please try again later.'
      })
    };
  }
};
