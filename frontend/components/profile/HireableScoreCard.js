export default function HireableScoreCard({ profile }) {
  const getScoreColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!profile?.hireableScore) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900">Hireable Score</h3>
        </div>
        <span className={`text-3xl font-bold ${getScoreColor(profile.hireableScore)}`}>
          {profile.hireableScore}%
        </span>
      </div>
      
      <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full ${getScoreBarColor(profile.hireableScore)} transition-all duration-500`}
          style={{ width: `${profile.hireableScore}%` }}
        ></div>
      </div>
      
      <p className="text-blue-700 text-sm">
        Based on skills, experience, and platform activity
      </p>
    </div>
  );
}