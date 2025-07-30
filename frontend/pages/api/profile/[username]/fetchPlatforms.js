// API route to handle platform data fetching
export default async function handler(req, res) {
  const { method } = req;
  const { username } = req.query;

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const backendResponse = await fetch(`http://localhost:5000/api/profile/${username}/fetchPlatforms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(req.body),
    });

    const data = await backendResponse.json();

    if (backendResponse.ok) {
      res.status(backendResponse.status).json(data);
    } else {
      res.status(backendResponse.status).json(data);
    }
  } catch (error) {
    console.error('Error proxying platform fetch request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process platform fetch request' 
    });
  }
}