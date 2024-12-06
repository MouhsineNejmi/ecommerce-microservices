import { getCurrentUser } from '@/actions/get-current-user';

import { ProfileForm } from '@/components/forms/profile.form';

const ProfilePage = async () => {
  const { data: user } = await getCurrentUser();

  return <ProfileForm user={user!} />;
};

export default ProfilePage;
