const crypto = require('crypto')

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
    const { username, password } = JSON.parse(event.body)
    
    // Validate credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' // 'secret123'
    
    // Hash the provided password
    const providedPasswordHash = crypto.createHash('sha256').update(password).digest('hex')
    
    if (username === adminUsername && providedPasswordHash === adminPasswordHash) {
      // Generate a simple session token
      const sessionToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': `htk_admin_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Expires=${expiresAt.toUTCString()}`
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Authentication successful',
          sessionToken: sessionToken,
          expiresAt: expiresAt.toISOString()
        })
      }
    } else {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Invalid credentials' 
        })
      }
    }

  } catch (error) {
    console.error('Admin authentication error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Authentication failed',
        details: error.message 
      })
    }
  }
}
