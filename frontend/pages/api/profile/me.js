// API route to proxy profile/me requests to backend
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    // Proxy the request to the backend server
    const backendResponse = await fetch('http://localhost:5000/api/profile/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await backendResponse.json();

    if (backendResponse.ok) {
      res.status(200).json(data);
    } else {
      res.status(backendResponse.status).json(data);
    }
  } catch (error) {
    console.error('Error proxying profile/me request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile data' 
    });
  }
}