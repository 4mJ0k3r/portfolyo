import HireableScoreCard from './HireableScoreCard';
import JobSeekingCard from './JobSeekingCard';
import CompletionCard from './CompletionCard';

export default function MetaCards({ profile }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <HireableScoreCard profile={profile} />
      <JobSeekingCard profile={profile} />
      <CompletionCard profile={profile} />
    </div>
  );
}