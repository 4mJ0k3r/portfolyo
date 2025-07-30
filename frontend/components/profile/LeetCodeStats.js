export default function LeetCodeStats({ stats }) {
  if (!stats || stats.totalSolved === 0) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-orange-600 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">LC</span>
        </div>
        <h3 className="text-xl font-bold text-orange-800">LeetCode</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-orange-600">Total Solved</span>
          <span className="text-2xl font-bold text-orange-800">{stats.totalSolved || 0}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-green-100 text-green-800 px-2 py-3 rounded text-center">
            <div className="text-sm font-medium">Easy</div>
            <div className="text-lg font-bold">{stats.easySolved || 0}</div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-2 py-3 rounded text-center">
            <div className="text-sm font-medium">Medium</div>
            <div className="text-lg font-bold">{stats.mediumSolved || 0}</div>
          </div>
          <div className="bg-red-100 text-red-800 px-2 py-3 rounded text-center">
            <div className="text-sm font-medium">Hard</div>
            <div className="text-lg font-bold">{stats.hardSolved || 0}</div>
          </div>
        </div>
        
        {/* Progress Bars */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">Easy Progress</span>
            <span className="text-green-700 font-medium">
              {stats.easySolved || 0}
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min((stats.easySolved || 0) / 10, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-700">Medium Progress</span>
            <span className="text-yellow-700 font-medium">
              {stats.mediumSolved || 0}
            </span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${Math.min((stats.mediumSolved || 0) / 10, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-700">Hard Progress</span>
            <span className="text-red-700 font-medium">
              {stats.hardSolved || 0}
            </span>
          </div>
          <div className="w-full bg-red-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-red-500 transition-all duration-500"
              style={{ width: `${Math.min((stats.hardSolved || 0) / 5, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {stats.lastFetched && (
          <div className="text-xs text-orange-500 mt-4">
            Last updated: {new Date(stats.lastFetched).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}