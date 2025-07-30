import GitHubStats from './GitHubStats';
import CodeforcesStats from './CodeforcesStats';
import LeetCodeStats from './LeetCodeStats';

export default function PlatformStats({ profile }) {
  const platformStats = profile?.platformStats;
  
  if (!platformStats) return null;

  const hasAnyStats = 
    (platformStats.github && (platformStats.github.totalRepos > 0 || platformStats.github.totalStars > 0)) ||
    (platformStats.codeforces && (platformStats.codeforces.rating > 0 || platformStats.codeforces.maxRating > 0)) ||
    (platformStats.leetcode && platformStats.leetcode.totalSolved > 0);

  if (!hasAnyStats) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        Platform Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GitHubStats stats={platformStats.github} />
        <CodeforcesStats stats={platformStats.codeforces} />
        <LeetCodeStats stats={platformStats.leetcode} />
      </div>
    </div>
  );
}