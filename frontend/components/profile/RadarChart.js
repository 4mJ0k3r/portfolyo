import { useState, useEffect } from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function RadarChart({ profile }) {
  const [chartData, setChartData] = useState([]);
  const [hasValidData, setHasValidData] = useState(false);

  useEffect(() => {
    if (profile?.radarAxes) {
      const axes = profile.radarAxes;
      const data = [
        { axis: 'Code Activity', value: axes.codeActivity || 0, anchor: '#platform-stats' },
        { axis: 'Problem Solving', value: axes.problemSolving || 0, anchor: '#platform-stats' },
        { axis: 'Project Impact', value: axes.projectImpact || 0, anchor: '#repos-projects' },
        { axis: 'Writing & Docs', value: axes.writingDocumentation || 0, anchor: '#about-contact' },
        { axis: 'Social & Community', value: axes.socialCommunity || 0, anchor: '#about-contact' },
        { axis: 'Verification & Trust', value: axes.verificationTrust || 0, anchor: '#verification-badges' }
      ];
      
      setChartData(data);
      setHasValidData(data.some(item => item.value > 0));
    } else {
      setHasValidData(false);
    }
  }, [profile]);

  const handleAnchorClick = (anchor) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatLastAnalyzed = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Profile Analysis Pending</h3>
      <p className="text-gray-600 mb-4 max-w-md mx-auto">
        The radar chart will appear after your profile data is analyzed. This visualization shows your strengths across six key dimensions.
      </p>
      <p className="text-sm text-gray-500">
        Profile owners can refresh analysis from their profile editor to generate this chart.
      </p>
    </div>
  );

  if (!hasValidData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Overview (Radar)</h2>
          <p className="text-gray-600">Comprehensive analysis across six key dimensions</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Overview (Radar)</h2>
        <p className="text-gray-600">Comprehensive analysis across six key dimensions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area - 2/3 on desktop */}
        <div className="lg:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart data={chartData}>
                <PolarGrid gridType="polygon" className="stroke-gray-200" />
                <PolarAngleAxis 
                  dataKey="axis" 
                  tick={{ fontSize: 12, fill: '#374151' }}
                  className="text-gray-700"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickCount={6}
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Accessibility - Screen reader content */}
          <div className="sr-only">
            <h3>Profile Radar Chart Data</h3>
            <ul>
              {chartData.map((item, index) => (
                <li key={index}>
                  {item.axis}: {item.value} out of 100
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legend Area - 1/3 on desktop */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
            
            {/* Legend Items */}
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleAnchorClick(item.anchor)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {item.axis}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {item.value}
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Normalization Note */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Note:</span> All dimensions are normalized to a 0-100 scale for comparison.
              </p>
              
              {/* Metadata */}
              {(profile?.aiAnalysis?.lastAnalyzed || profile?.aiAnalysis?.dataSourcesUsed) && (
                <div className="text-xs text-gray-500 space-y-1">
                  {profile.aiAnalysis.lastAnalyzed && (
                    <div>
                      <span className="font-medium">Last analyzed:</span> {formatLastAnalyzed(profile.aiAnalysis.lastAnalyzed)}
                    </div>
                  )}
                  {profile.aiAnalysis.dataSourcesUsed && profile.aiAnalysis.dataSourcesUsed.length > 0 && (
                    <div>
                      <span className="font-medium">Data sources:</span> {profile.aiAnalysis.dataSourcesUsed.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}