import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProfileEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Profile state
  const [profileData, setProfileData] = useState({
    // Contact Info
    phone: '',
    location: '',
    
    // Social Handles
    githubUsername: '',
    linkedinUrl: '',
    twitterHandle: '',
    codeforcesUsername: '',
    leetcodeUsername: '',
    stackoverflowId: '',
    
    // Job Preferences
    jobSeekingStatus: 'actively_looking',
    preferredRoles: '',
    expectedSalary: '',
    workPreference: 'remote',
    
    // Bio & Headline
    headline: '',
    bio: '',
    
    // Dynamic Arrays
    skills: [],
    experience: [],
    projects: []
  });

  // Check authentication and fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/login');
      return;
    }

    fetchProfile(token);
  }, []);

  // Fetch existing profile
  const fetchProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const profile = data.profile;
        
        // Map profile data to form state
        setProfileData({
          phone: profile.phone || '',
          location: profile.location || '',
          githubUsername: profile.githubUsername || '',
          linkedinUrl: profile.linkedinUrl || '',
          twitterHandle: profile.twitterHandle || '',
          codeforcesUsername: profile.codeforcesUsername || '',
          leetcodeUsername: profile.leetcodeUsername || '',
          stackoverflowId: profile.stackoverflowId || '',
          jobSeekingStatus: profile.jobSeekingStatus || 'actively_looking',
          preferredRoles: Array.isArray(profile.preferredRoles) ? profile.preferredRoles.join(', ') : '',
          expectedSalary: profile.expectedSalary || '',
          workPreference: profile.workPreference || 'remote',
          headline: profile.headline || '',
          bio: profile.bio || '',
          skills: profile.skills || [],
          experience: profile.experience || [],
          projects: (profile.projects || []).map(project => ({
            ...project,
            techStack: Array.isArray(project.techStack) 
              ? project.techStack.join(', ') 
              : project.techStack || ''
          }))
        });
      } else if (response.status === 404) {
        // No profile exists yet - keep empty form
        console.log('No profile found, starting with empty form');
      } else {
        setMessage('Error fetching profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Skills management
  const addSkill = () => {
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', proficiency: 1, verified: false, yearsOfExperience: 0, category: 'Other' }]
    }));
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  // Experience management
  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        role: '',
        from: '',
        to: '',
        current: false,
        workType: 'Full-time',
        achievements: ''
      }]
    }));
  };

  const removeExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Projects management
  const addProject = () => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        liveDemo: '',
        featured: false,
        status: 'Completed'
      }]
    }));
  };

  const removeProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  // Platform sync
  const syncPlatforms = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user?.username) {
      setMessage('Username not found');
      return;
    }

    setSyncing(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${user.username}/fetchPlatforms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Platform stats synced successfully!');
        // Reload profile data to show updated stats
        fetchProfile(token);
      } else {
        setMessage(`❌ Sync failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Platform sync error:', error);
      setMessage('❌ Error syncing platform stats');
    } finally {
      setSyncing(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!profileData.headline.trim()) newErrors.headline = 'Headline is required';
    if (!profileData.bio.trim()) newErrors.bio = 'Bio is required';

    // Skills validation
    profileData.skills.forEach((skill, index) => {
      if (!skill.name.trim()) {
        newErrors[`skill_${index}`] = 'Skill name is required';
      }
    });

    // Experience validation
    profileData.experience.forEach((exp, index) => {
      if (!exp.company.trim() || !exp.role.trim()) {
        newErrors[`experience_${index}`] = 'Company and role are required';
      }
    });

    // Projects validation
    profileData.projects.forEach((project, index) => {
      if (!project.title.trim()) {
        newErrors[`project_${index}`] = 'Project title is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('❌ Please fix the errors below');
      return;
    }

    setSaving(true);
    setMessage('');

    const token = localStorage.getItem('token');
    
    // Prepare data for submission
    const submitData = {
      ...profileData,
      preferredRoles: profileData.preferredRoles.split(',').map(role => role.trim()).filter(role => role),
      projects: profileData.projects.map(project => ({
        ...project,
        techStack: Array.isArray(project.techStack) 
          ? project.techStack 
          : project.techStack.split(',').map(tech => tech.trim()).filter(tech => tech)
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Profile saved successfully!');
        setErrors({});
      } else {
        setMessage(`❌ Save failed: ${data.message}`);
        if (data.errors) {
          // Handle validation errors from backend
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors.general = error;
          });
          setErrors(backendErrors);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('❌ Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

          {message && (
            <div className={`p-4 rounded-md mb-6 ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </section>

            {/* Social Handles */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Social Handles & Platform Usernames</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Username</label>
                  <input
                    type="text"
                    name="githubUsername"
                    value={profileData.githubUsername}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="octocat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={profileData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Handle</label>
                  <input
                    type="text"
                    name="twitterHandle"
                    value={profileData.twitterHandle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Codeforces Username</label>
                  <input
                    type="text"
                    name="codeforcesUsername"
                    value={profileData.codeforcesUsername}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tourist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode Username</label>
                  <input
                    type="text"
                    name="leetcodeUsername"
                    value={profileData.leetcodeUsername}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="leetcodeuser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">StackOverflow ID</label>
                  <input
                    type="text"
                    name="stackoverflowId"
                    value={profileData.stackoverflowId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345678"
                  />
                </div>
              </div>
            </section>

            {/* Job Preferences */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Job Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job-seeking Status</label>
                  <select
                    name="jobSeekingStatus"
                    value={profileData.jobSeekingStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="actively_looking">Actively Looking</option>
                    <option value="open_to_opportunities">Open to Opportunities</option>
                    <option value="not_looking">Not Looking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Preference</label>
                  <select
                    name="workPreference"
                    value={profileData.workPreference}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Roles</label>
                  <input
                    type="text"
                    name="preferredRoles"
                    value={profileData.preferredRoles}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Frontend, Fullstack, Backend"
                  />
                  <p className="text-sm text-gray-500 mt-1">Comma-separated list</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={profileData.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50k-70k USD"
                  />
                </div>
              </div>
            </section>

            {/* Bio & Headline */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Bio & Headline</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Headline *</label>
                  <input
                    type="text"
                    name="headline"
                    value={profileData.headline}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.headline ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Full Stack Developer | React & Node.js Expert"
                  />
                  {errors.headline && <p className="text-red-500 text-sm mt-1">{errors.headline}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">My Skills</h2>
              <div className="space-y-4">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`skill_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Skill name (e.g., React, Python)"
                    />
                    <select
                      value={skill.proficiency}
                      onChange={(e) => updateSkill(index, 'proficiency', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Basic</option>
                      <option value={3}>3 - Intermediate</option>
                      <option value={4}>4 - Advanced</option>
                      <option value={5}>5 - Expert</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  + Add Skill
                </button>
              </div>
            </section>

            {/* Experience */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Experience</h2>
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name"
                      />
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Job title"
                      />
                      <input
                        type="date"
                        value={exp.from}
                        onChange={(e) => updateExperience(index, 'from', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={exp.to}
                        onChange={(e) => updateExperience(index, 'to', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={exp.current}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        Currently working here
                      </label>
                    </div>
                    <textarea
                      value={exp.achievements}
                      onChange={(e) => updateExperience(index, 'achievements', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Key achievements and responsibilities..."
                    />
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove Experience
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  + Add Experience
                </button>
              </div>
            </section>

            {/* Projects */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Projects</h2>
              <div className="space-y-6">
                {profileData.projects.map((project, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Project title"
                      />
                      <input
                        type="text"
                        value={project.techStack}
                        onChange={(e) => updateProject(index, 'techStack', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tech stack (comma-separated)"
                      />
                      <input
                        type="url"
                        value={project.githubLink}
                        onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="GitHub repository URL"
                      />
                      <input
                        type="url"
                        value={project.liveDemo}
                        onChange={(e) => updateProject(index, 'liveDemo', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Live demo URL"
                      />
                    </div>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                      placeholder="Project description..."
                    />
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove Project
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  + Add Project
                </button>
              </div>
            </section>

            {/* Platform Sync */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Platform Sync</h2>
              <p className="text-gray-600 mb-4">
                Sync your latest stats from GitHub, Codeforces, and LeetCode to showcase your coding achievements.
              </p>
              <button
                type="button"
                onClick={syncPlatforms}
                disabled={syncing}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {syncing ? 'Syncing...' : 'Sync My GitHub, Codeforces & LeetCode Stats'}
              </button>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 