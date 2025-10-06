const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Admin email
const ADMIN_EMAIL = 'handytoknowteam@gmail.com';

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

// In-memory storage for reset codes (in production, use Redis or database)
let resetCodes = new Map();

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

    // Check if email is the authorized admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Unauthorized access. Admin access only.' 
        })
      };
    }

    if (action === 'request') {
      // Generate reset code
      const code = generateResetCode();
      const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes

      // Store reset code
      resetCodes.set(email, { code, expiresAt });

      // Send reset email
      try {
        const transporter = createEmailTransporter();
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'handytoknowteam@gmail.com',
          to: email,
          subject: 'H2K Admin - Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
              <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
                <h1 style="color: #B9975B; margin: 0; font-size: 28px;">H2K Admin Portal</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0;">Password Reset Request</p>
              </div>
              <div style="padding: 30px; background: #ffffff;">
                <h2 style="color: #333; margin-top: 0;">Admin Password Reset</h2>
                <p style="color: #666; line-height: 1.6;">
                  A password reset has been requested for your HTK admin account. 
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
                    This is an automated message from H2K Admin Portal. Please do not reply to this email.
                  </p>
                </div>
              </div>
            </div>
          `
        });

        // Log reset request for security
        console.log(`Admin password reset requested for: ${email} at ${new Date().toISOString()}`);

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

      // Check if reset code exists and is valid
      const storedData = resetCodes.get(email);
      if (!storedData || storedData.code !== resetCode || Date.now() > storedData.expiresAt) {
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

      // In production, you would update the password hash in your secure storage
      // For now, we'll just log it and clear the reset code
      const newPasswordHash = hashPassword(newPassword);
      console.log(`Admin password reset completed for: ${email} at ${new Date().toISOString()}`);
      console.log(`New password hash: ${newPasswordHash}`);
      
      // Clear the reset code
      resetCodes.delete(email);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Password reset successful. You can now log in with your new password.',
          note: 'Please update your environment variables with the new password hash for production use.'
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
    console.error('Admin password reset error:', error);
    
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
