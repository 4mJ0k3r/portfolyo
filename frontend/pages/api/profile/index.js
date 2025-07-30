// API route to handle profile operations (GET, POST, PUT)
export default async function handler(req, res) {
  const { method } = req;

  try {
    let backendResponse;
    const token = req.headers.authorization;

    switch (method) {
      case 'GET':
        // Get profile
        if (!token) {
          return res.status(401).json({ message: 'Authorization token required' });
        }

        backendResponse = await fetch('http://localhost:5000/api/profile/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        break;

      case 'POST':
      case 'PUT':
        // Create or update profile
        if (!token) {
          return res.status(401).json({ message: 'Authorization token required' });
        }

        backendResponse = await fetch('http://localhost:5000/api/profile', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify(req.body),
        });
        break;

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const data = await backendResponse.json();

    if (backendResponse.ok) {
      res.status(backendResponse.status).json(data);
    } else {
      res.status(backendResponse.status).json(data);
    }
  } catch (error) {
    console.error('Error proxying profile request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process profile request' 
    });
  }
}