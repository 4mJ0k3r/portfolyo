import SkillBar from './SkillBar';

export default function SkillsSection({ profile }) {
  const skills = profile?.skills || [];
  
  if (skills.length === 0) return null;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        Skills & Expertise
      </h2>

      {/* Overall Proficiency */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Overall Proficiency</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-700">Skill Level</span>
          <span className="text-2xl font-bold text-purple-800">
            {Math.round((skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length) * 20)}%
          </span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ 
              width: `${Math.round((skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length) * 20)}%` 
            }}
          ></div>
        </div>
        <p className="text-sm text-purple-600 mt-2">
          Based on {skills.length} skills • {skills.filter(s => s.verified).length} verified
        </p>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              {category}
              <span className="ml-2 text-sm text-gray-500">({categorySkills.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill, index) => (
                <SkillBar key={`${skill.name}-${index}`} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Verified Skills Summary */}
      {skills.some(s => s.verified) && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Verified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.filter(s => s.verified).map((skill, index) => (
              <span 
                key={`verified-${skill.name}-${index}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}