import AvatarAndIdentity from './AvatarAndIdentity';
import MetaCards from './MetaCards';

export default function ProfileHeader({ profile, user }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <AvatarAndIdentity profile={profile} user={user} />
      <MetaCards profile={profile} />
    </div>
  );
}