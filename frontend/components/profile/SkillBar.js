export default function SkillBar({ skill }) {
  const getProficiencyColor = (level) => {
    switch (level) {
      case 5: return 'bg-green-500';
      case 4: return 'bg-blue-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-orange-500';
      case 1: return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getProficiencyText = (level) => {
    switch (level) {
      case 5: return 'Expert';
      case 4: return 'Advanced';
      case 3: return 'Intermediate';
      case 2: return 'Beginner';
      case 1: return 'Novice';
      default: return 'Unknown';
    }
  };

  const getProficiencyTextColor = (level) => {
    switch (level) {
      case 5: return 'text-green-700';
      case 4: return 'text-blue-700';
      case 3: return 'text-yellow-700';
      case 2: return 'text-orange-700';
      case 1: return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h4 className="font-medium text-gray-900">{skill.name}</h4>
          {skill.verified && (
            <div className="ml-2 flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${getProficiencyTextColor(skill.proficiency)}`}>
            {getProficiencyText(skill.proficiency)}
          </div>
          <div className="text-xs text-gray-500">
            {skill.proficiency}/5
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)} transition-all duration-500`}
          style={{ width: `${(skill.proficiency / 5) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        {skill.yearsOfExperience !== undefined && skill.yearsOfExperience > 0 && (
          <span>{skill.yearsOfExperience} years experience</span>
        )}
        {skill.category && (
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">
            {skill.category}
          </span>
        )}
      </div>
    </div>
  );
}