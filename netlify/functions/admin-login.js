const crypto = require('crypto');

// Admin credentials - in production, these should be stored securely
const ADMIN_EMAIL = 'handytoknowteam@gmail.com';
// This should be set as an environment variable in production
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || crypto.createHash('sha256').update('HTK2024Admin!').digest('hex');

// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate JWT token (simplified - in production use proper JWT library)
function generateAdminToken(email) {
  const payload = {
    email,
    type: 'admin',
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
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
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Email and password are required' 
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

    // Check password
    const hashedPassword = hashPassword(password);
    
    if (hashedPassword !== ADMIN_PASSWORD_HASH) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid email or password' 
        })
      };
    }

    // Generate authentication token
    const token = generateAdminToken(email);

    // Log admin login for security
    console.log(`Admin login successful: ${email} at ${new Date().toISOString()}`);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          email: email,
          role: 'admin',
          loginTime: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('Admin login error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Login failed. Please try again later.'
      })
    };
  }
};
