import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Import all the new profile components
import AvatarAndIdentity from '../../components/profile/AvatarAndIdentity';
import MetaCards from '../../components/profile/MetaCards';
import RadarChart from '../../components/profile/RadarChart';
import AboutAndContact from '../../components/profile/AboutAndContact';
import VerificationBadges from '../../components/profile/VerificationBadges';
import SkillsSection from '../../components/profile/SkillsSection';
import ReposAndProjects from '../../components/profile/ReposAndProjects';
import PlatformStats from '../../components/profile/PlatformStats';
import AINarrative from '../../components/profile/AINarrative';

export default function PublicProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching profile for username:', username);
      const response = await fetch(`/api/profile/${username}`);
      const data = await response.json();
      
      console.log('📡 API Response Status:', response.status);
      console.log('📦 Raw API Response:', data);

      if (response.ok) {
        // Extract the profile data from the API response
        const profileData = data.profile || data;
        console.log('✅ Profile Data Extracted:', profileData);
        setProfile(profileData);
      } else {
        console.error('❌ API Error:', data.message);
        setError(data.message || 'Profile not found');
      }
    } catch (error) {
      console.error('💥 Fetch Error:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Profile</h2>
          <p className="text-gray-500">Fetching the latest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-8xl mb-6">😔</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6 text-lg">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Head>
        <title>{profile?.user?.name || profile?.user?.username || 'Profile'} - PortFolyo</title>
        <meta 
          name="description" 
          content={`Professional profile of ${profile?.user?.name || profile?.user?.username} - Skills, projects, and achievements`} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Profile Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Avatar and Identity - Takes 1 column */}
          <div className="lg:col-span-1">
            <AvatarAndIdentity profile={profile} />
          </div>
          
          {/* Meta Cards - Takes 2 columns */}
          <div className="lg:col-span-2">
            <MetaCards profile={profile} />
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="w-full">
          <RadarChart profile={profile} />
        </div>

        {/* About and Contact Section */}
        <div id="about-contact" className="w-full">
          <AboutAndContact profile={profile} />
        </div>

        {/* Verification Badges */}
        <div id="verification-badges" className="w-full">
          <VerificationBadges profile={profile} />
        </div>

        {/* Skills Section */}
        <div className="w-full">
          <SkillsSection profile={profile} />
        </div>

        {/* Repositories and Projects */}
        <div id="repos-projects" className="w-full">
          <ReposAndProjects profile={profile} />
        </div>
        
        {/* Platform Statistics */}
        <div id="platform-stats" className="w-full">
          <PlatformStats profile={profile} />
        </div>

        {/* AI Narrative Section - Full Width */}
        <div className="w-full">
          <AINarrative profile={profile} />
        </div>

        {/* Debug Section - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">🔧 Debug Information</h2>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  console.log('Profile Data:', profile);
                  alert(`Profile Data logged to console`);
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 mr-4 transition-colors duration-200"
              >
                Log Profile Data
              </button>
              <button 
                onClick={() => {
                  console.log('Current Route:', router.asPath);
                  console.log('Username:', username);
                  alert(`Route: ${router.asPath}\nUsername: ${username}`);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-4 transition-colors duration-200"
              >
                Show Route Info
              </button>
              <button 
                onClick={() => {
                  const hasAIData = profile?.primaryExpertise || profile?.hireableScore || profile?.narrativeSummary;
                  alert(`Has AI Data: ${hasAIData}\nPrimary Expertise: ${profile?.primaryExpertise || 'None'}\nHireable Score: ${profile?.hireableScore || 'None'}\nNarrative: ${profile?.narrativeSummary ? 'Present' : 'None'}`);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Check AI Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}