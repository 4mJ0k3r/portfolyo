export default function CompletionCard({ profile }) {
  const completeness = profile?.completeness || 0;
  
  const getCompletenessColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompletenessBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCompletenessMessage = (percentage) => {
    if (percentage >= 80) return 'Profile looks great!';
    if (percentage >= 60) return 'Almost complete';
    if (percentage >= 40) return 'Good progress';
    return 'Needs more info';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900">Profile Completion</h3>
        </div>
        <span className={`text-3xl font-bold ${getCompletenessColor(completeness)}`}>
          {completeness}%
        </span>
      </div>
      
      <div className="w-full bg-green-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full ${getCompletenessBarColor(completeness)} transition-all duration-500`}
          style={{ width: `${completeness}%` }}
        ></div>
      </div>
      
      <p className="text-green-700 text-sm mb-3">
        {getCompletenessMessage(completeness)}
      </p>

      {profile?.profileViews !== undefined && (
        <div className="flex items-center text-sm text-green-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {profile.profileViews} profile views
        </div>
      )}
    </div>
  );
}