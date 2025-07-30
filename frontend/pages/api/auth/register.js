// API route to proxy auth/register requests to backend
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Proxy the request to the backend server
    const backendResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await backendResponse.json();

    if (backendResponse.ok) {
      res.status(200).json(data);
    } else {
      res.status(backendResponse.status).json(data);
    }
  } catch (error) {
    console.error('Error proxying register request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process registration request' 
    });
  }
}