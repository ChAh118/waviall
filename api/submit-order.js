export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ result: 'error', error: 'Method not allowed' });
  }

  try {
    const { rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ result: 'error', error: 'Invalid request: no rows provided' });
    }

    // Get your Google Apps Script URL from environment variable
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      console.error('GOOGLE_SCRIPT_URL not configured');
      return res.status(500).json({ result: 'error', error: 'Server configuration error' });
    }

    // Forward to Google Apps Script
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rows }),
    });

    const data = await response.json();

    if (data.result === 'success') {
      return res.status(200).json({ result: 'success' });
    } else {
      return res.status(500).json({ result: 'error', error: data.error || 'Google Apps Script error' });
    }
  } catch (error) {
    console.error('Order submission error:', error);
    return res.status(500).json({ result: 'error', error: error.message || 'Internal server error' });
  }
}
