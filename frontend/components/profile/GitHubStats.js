export default function GitHubStats({ stats }) {
  if (!stats || (stats.totalRepos === 0 && stats.totalStars === 0)) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <svg className="w-8 h-8 mr-3 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800">GitHub</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Repositories</span>
          <span className="text-2xl font-bold text-gray-800">{stats.totalRepos || 0}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Stars</span>
          <span className="text-2xl font-bold text-yellow-600">{stats.totalStars || 0}</span>
        </div>
        
        {stats.languages && Object.keys(stats.languages).length > 0 && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2 text-sm">Top Languages:</p>
            <div className="space-y-2">
              {Object.entries(stats.languages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([lang, count]) => (
                  <div key={lang} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{lang}</span>
                    <span className="text-sm font-medium text-gray-800">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {stats.lastFetched && (
          <div className="text-xs text-gray-500 mt-4">
            Last updated: {new Date(stats.lastFetched).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}