export default function Summary({ profile }) {
  if (!profile?.narrativeSummary) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Analysis Available</h3>
        <p className="text-gray-500">AI analysis will be generated based on your profile data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Expertise */}
      {profile.primaryExpertise && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Primary Expertise
          </h3>
          <p className="text-purple-800 text-lg font-medium">{profile.primaryExpertise}</p>
        </div>
      )}

      {/* Hireable Score Summary */}
      {profile.hireableScore !== undefined && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hireable Score: {profile.hireableScore}%
          </h3>
          
          {profile.subScores && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {profile.subScores.codeActivityScore !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.subScores.codeActivityScore}/5</div>
                  <div className="text-sm text-blue-700">Code Activity</div>
                </div>
              )}
              {profile.subScores.writingScore !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profile.subScores.writingScore}/5</div>
                  <div className="text-sm text-green-700">Writing Quality</div>
                </div>
              )}
              {profile.subScores.socialFitScore !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.subScores.socialFitScore}/5</div>
                  <div className="text-sm text-purple-700">Social Fit</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Narrative Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          AI Assessment Summary
        </h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {profile.narrativeSummary}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Strengths
          </h4>
          <ul className="text-sm text-green-800 space-y-1">
            {profile.primaryExpertise && (
              <li>• Strong expertise in {profile.primaryExpertise.toLowerCase()}</li>
            )}
            {profile.hireableScore >= 70 && (
              <li>• High hireable score indicates strong market readiness</li>
            )}
            {profile.subScores?.codeActivityScore >= 4 && (
              <li>• Excellent coding activity and contribution</li>
            )}
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Opportunities
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {profile.hireableScore < 70 && (
              <li>• Room for improvement in overall hireable score</li>
            )}
            {profile.subScores?.writingScore < 3 && (
              <li>• Enhance documentation and communication skills</li>
            )}
            {profile.subScores?.socialFitScore < 3 && (
              <li>• Increase community engagement and networking</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}