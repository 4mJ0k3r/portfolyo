// API route to proxy profile requests to backend
export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log(`🔄 Proxy: Fetching profile for ${username} from backend`);
    
    // Proxy the request to the backend server
    const backendResponse = await fetch(`http://localhost:5000/api/profile/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();
    
    console.log(`📦 Proxy: Backend response status:`, backendResponse.status);
    console.log(`🧠 Proxy: AI fields in backend response:`, {
      primaryExpertise: data.profile?.primaryExpertise,
      hireableScore: data.profile?.hireableScore,
      subScores: data.profile?.subScores,
      narrativeSummary: data.profile?.narrativeSummary
    });

    if (backendResponse.ok) {
      res.status(200).json(data);
    } else {
      res.status(backendResponse.status).json(data);
    }
  } catch (error) {
    console.error('Error proxying profile request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile data' 
    });
  }
}