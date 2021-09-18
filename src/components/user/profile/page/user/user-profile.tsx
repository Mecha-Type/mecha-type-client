import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useFollowsUserQuery, User, UserFragment, useUserFollowersQuery } from 'generated/graphql';
import { Session } from 'next-auth';
import { Container } from '@chakra-ui/react';
import { EditUserProfile } from '../../edit';
import { CountryEntry } from '@pages/user/[id]';

const UserProfileDetails = dynamic(() => import('@components/user/profile/page/user/details/user-profile-details'));

const UserProfileInformation = dynamic(
  () => import('@components/user/profile/page/user/details/user-profile-information')
);

interface IUserProfileProps {
  /** Current logged in user */
  user: UserFragment;
  /** Target user to show profile */
  targetUser: UserFragment;
  /** Wether content is loading or not */
  loading: boolean;
  /** If the current logged in user is the same as the profile page */
  ownsPage: boolean;
  /** Session object */
  session: Session;
  /** Countries data */
  countries: CountryEntry[];
}

const UserProfile: React.FC<IUserProfileProps> = ({ user, targetUser, loading, ownsPage, session, countries }) => {
  const [editing, setEditing] = useState(false);

  const { data: followersData, refetch: followersRefetch } = useUserFollowersQuery({
    skip: targetUser?.id === undefined,
    variables: {
      userId: targetUser?.id,
    },
  });

  const { data: followsUserData, refetch: followsUserRefetch } = useFollowsUserQuery({
    skip: user?.id === targetUser?.id,
    variables: {
      userId: user?.id! ?? '',
      targetUserId: targetUser?.id ?? '',
    },
  });

  // If editing, return the edit profile component.
  if (editing) {
    return (
      <EditUserProfile
        user={targetUser as User}
        loading={loading}
        countries={countries}
        onUpdatedCallback={() => {
          setEditing(false);
        }}
      />
    );
  }

  return (
    <Container maxW={['1xl', '2xl', '3xl', '5xl', '7xl']}>
      <UserProfileDetails
        user={user}
        targetUser={targetUser}
        loading={loading}
        session={session}
        ownsPage={ownsPage}
        followsUser={followsUserData?.followsUser?.valueOf()!}
        followersRefetch={followersRefetch}
        followsUserRefetch={followsUserRefetch}
        settingsButtonClick={() => setEditing(true)}
      />
      <UserProfileInformation
        loading={loading}
        targetUser={targetUser}
        followers={followersData?.userFollowers?.users!}
      />
    </Container>
  );
};

export default UserProfile;
