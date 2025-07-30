export default function CodeforcesStats({ stats }) {
  if (!stats || (stats.rating === 0 && stats.maxRating === 0)) return null;

  const getRatingColor = (rating) => {
    if (rating >= 3000) return 'text-red-600'; // Legendary Grandmaster
    if (rating >= 2600) return 'text-red-500'; // International Grandmaster
    if (rating >= 2400) return 'text-orange-500'; // Grandmaster
    if (rating >= 2300) return 'text-orange-400'; // International Master
    if (rating >= 2100) return 'text-yellow-500'; // Master
    if (rating >= 1900) return 'text-purple-500'; // Candidate Master
    if (rating >= 1600) return 'text-blue-500'; // Expert
    if (rating >= 1400) return 'text-cyan-500'; // Specialist
    if (rating >= 1200) return 'text-green-500'; // Pupil
    return 'text-gray-500'; // Newbie
  };

  const getRatingTitle = (rating) => {
    if (rating >= 3000) return 'Legendary Grandmaster';
    if (rating >= 2600) return 'International Grandmaster';
    if (rating >= 2400) return 'Grandmaster';
    if (rating >= 2300) return 'International Master';
    if (rating >= 2100) return 'Master';
    if (rating >= 1900) return 'Candidate Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">CF</span>
        </div>
        <h3 className="text-xl font-bold text-blue-800">Codeforces</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-600">Current Rating</span>
          <span className={`text-2xl font-bold ${getRatingColor(stats.rating)}`}>
            {stats.rating || 0}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-blue-600">Max Rating</span>
          <span className={`text-2xl font-bold ${getRatingColor(stats.maxRating)}`}>
            {stats.maxRating || 0}
          </span>
        </div>
        
        {stats.rating > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              {getRatingTitle(stats.rating)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Current Rank
            </div>
          </div>
        )}
        
        {stats.maxRating > stats.rating && (
          <div className="mt-2 p-3 bg-blue-100 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              {getRatingTitle(stats.maxRating)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Highest Rank Achieved
            </div>
          </div>
        )}
        
        {stats.lastFetched && (
          <div className="text-xs text-blue-500 mt-4">
            Last updated: {new Date(stats.lastFetched).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}