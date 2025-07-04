import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

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
      
      const response = await fetch(`http://localhost:5000/api/profile/${username}`);
      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
      } else {
        setError(data.message || 'Profile not found');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Prepare skills data for radar chart
  const prepareRadarData = () => {
    if (!profile?.skills || profile.skills.length === 0) {
      return [];
    }

    return profile.skills.slice(0, 6).map(skill => ({
      skill: skill.name,
      proficiency: skill.proficiency * 20, // Convert 1-5 scale to 0-100 for better visualization
      fullMark: 100
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'actively_looking':
        return 'bg-green-100 text-green-800';
      case 'open_to_opportunities':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_looking':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'actively_looking':
        return 'Actively Looking';
      case 'open_to_opportunities':
        return 'Open to Opportunities';
      case 'not_looking':
        return 'Not Looking';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            
            {/* Profile Photo Placeholder */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.user.name}
              </h1>
              <p className="text-xl text-gray-600 mb-3">
                {profile.headline || 'Developer'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                {profile.location && (
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </div>
                )}
                
                {profile.jobSeekingStatus && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.jobSeekingStatus)}`}>
                    {getStatusText(profile.jobSeekingStatus)}
                  </span>
                )}
              </div>

              {profile.bio && (
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {profile.rank > 0 && (
                <div className="mt-4">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Rank: #{profile.rank}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Radar Chart */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Overview</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={prepareRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar
                    name="Proficiency"
                    dataKey="proficiency"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Skills List */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg px-4 py-2">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < skill.proficiency ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Timeline */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 md:mt-0">
                      {formatDate(exp.from)} – {exp.current ? 'Present' : formatDate(exp.to)}
                    </div>
                  </div>
                  {exp.achievements && (
                    <p className="text-gray-700 leading-relaxed">
                      {exp.achievements}
                    </p>
                  )}
                  {exp.workType && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {exp.workType}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Tech Stack Tags */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Project Links */}
                  <div className="flex space-x-4">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                        View Repo
                      </a>
                    )}
                    
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-600 hover:text-green-800 text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform Stats */}
        {profile.platformStats && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* GitHub Stats */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold">GitHub</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Repositories:</span> {profile.platformStats.github.totalRepos}</p>
                  <p><span className="font-medium">Total Stars:</span> {profile.platformStats.github.totalStars}</p>
                  {Object.keys(profile.platformStats.github.languages).length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(profile.platformStats.github.languages).map(([lang, count]) => (
                          <span key={lang} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {lang} ({count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Codeforces Stats */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
                  <h3 className="font-semibold">Codeforces</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Current Rating:</span> {profile.platformStats.codeforces.rating}</p>
                  <p><span className="font-medium">Max Rating:</span> {profile.platformStats.codeforces.maxRating}</p>
                </div>
              </div>

              {/* LeetCode Stats */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-orange-500 rounded mr-2"></div>
                  <h3 className="font-semibold">LeetCode</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Total Solved:</span> {profile.platformStats.leetcode.totalSolved}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                      Easy: {profile.platformStats.leetcode.easySolved}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">
                      Medium: {profile.platformStats.leetcode.mediumSolved}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-center">
                      Hard: {profile.platformStats.leetcode.hardSolved}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements & Verification Badges */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification & Achievements</h2>
          <div className="flex flex-wrap gap-4">
            
            {profile.verification?.videoVerified && (
              <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Video Verified
              </div>
            )}

            {profile.verification?.documentsVerified && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Documents Verified
              </div>
            )}

            {profile.verification?.skillTestsPassed > 0 && (
              <div className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Passed {profile.verification.skillTestsPassed} Skill Tests
              </div>
            )}

            {/* Default message if no verifications */}
            {!profile.verification?.videoVerified && 
             !profile.verification?.documentsVerified && 
             profile.verification?.skillTestsPassed === 0 && (
              <div className="text-gray-500 italic">
                No verifications completed yet
              </div>
            )}
          </div>

          {/* Profile Views */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Profile Views: {profile.profileViews || 0}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
} 