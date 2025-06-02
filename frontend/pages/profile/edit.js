import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProfileEdit() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          </div>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Profile Editor - Coming Soon!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              This page will be built in <strong>Phase 3</strong> of the development process.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Welcome, {user.name}! 🎉
            </h2>
            <p className="text-blue-800">
              Your registration/login was successful. Here's what we know about you:
            </p>
            <div className="mt-4 space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Type:</strong> {user.accountType}</p>
              <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What's Coming in Phase 3:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Complete profile editing form with all fields from the Profile model</li>
              <li>Skills management with proficiency levels</li>
              <li>Experience and projects management</li>
              <li>GitHub integration and verification</li>
              <li>File upload for profile pictures</li>
              <li>Real-time preview of public profile</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Go to Homepage
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
   
    </div>
  );
} 