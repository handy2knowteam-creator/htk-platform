const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password, rememberMe } = JSON.parse(event.body);

    // Validate required fields
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Email and password are required' 
        })
      };
    }

    // Initialize Google Sheets
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    // Get or create customers sheet
    let customersSheet = doc.sheetsByTitle['Customers'];
    if (!customersSheet) {
      customersSheet = await doc.addSheet({
        title: 'Customers',
        headerValues: [
          'Email', 'Password Hash', 'First Name', 'Last Name', 'Phone', 
          'Date of Birth', 'Address Line 1', 'Address Line 2', 'City', 
          'Postcode', 'Two Factor Enabled', 'Email Verified', 'Created At', 
          'Last Login', 'Status'
        ]
      });
    }

    // Find customer by email
    const rows = await customersSheet.getRows();
    const customer = rows.find(row => row.Email === email);

    if (!customer) {
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid email or password' 
        })
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer['Password Hash']);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid email or password' 
        })
      };
    }

    // Check if account is active
    if (customer.Status === 'Suspended' || customer.Status === 'Deleted') {
      return {
        statusCode: 403,
        body: JSON.stringify({ 
          success: false, 
          error: 'Account is not active. Please contact support.' 
        })
      };
    }

    // Update last login
    customer['Last Login'] = new Date().toISOString();
    await customer.save();

    // Check if two-factor authentication is enabled
    if (customer['Two Factor Enabled'] === 'TRUE') {
      // Generate and send 2FA code
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store 2FA code temporarily (in a real app, use Redis or similar)
      // For now, we'll store it in a separate sheet
      let twoFactorSheet = doc.sheetsByTitle['TwoFactorCodes'];
      if (!twoFactorSheet) {
        twoFactorSheet = await doc.addSheet({
          title: 'TwoFactorCodes',
          headerValues: ['Email', 'Code', 'Expires At', 'Used']
        });
      }

      // Add 2FA code
      await twoFactorSheet.addRow({
        Email: email,
        Code: twoFactorCode,
        'Expires At': new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        Used: 'FALSE'
      });

      // Send 2FA code via email
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'HTK - Two-Factor Authentication Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0;">HTK Platform</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Two-Factor Authentication</h2>
              <p>Your verification code is:</p>
              <div style="background: #1a1a1a; color: #D4AF37; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                ${twoFactorCode}
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
            </div>
          </div>
        `
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          requiresTwoFactor: true,
          message: 'Two-factor authentication code sent to your email'
        })
      };
    }

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      { 
        email: customer.Email,
        firstName: customer['First Name'],
        lastName: customer['Last Name'],
        customerId: customer.rowNumber
      },
      process.env.JWT_SECRET || 'htk-customer-secret-key',
      { expiresIn: tokenExpiry }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        token,
        customer: {
          email: customer.Email,
          firstName: customer['First Name'],
          lastName: customer['Last Name'],
          phone: customer.Phone
        }
      })
    };

  } catch (error) {
    console.error('Customer login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Login failed. Please try again.' 
      })
    };
  }
};
