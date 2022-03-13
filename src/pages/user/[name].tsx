import React, { useEffect, useState } from 'react';
import UserProfile from '@components/user/profile/page/user/user-profile';
import LayoutCore from 'layouts/core/components/core-layout';
import {
  User,
  UserDocument,
  UserQuery,
  UserQueryVariables,
  UsersQuery,
  UsersQueryVariables,
  UserTestPresetsHistoryDocument,
  UserTestPresetsHistoryQuery,
  UserTestPresetsHistoryQueryVariables,
} from 'generated/graphql';
import { GetStaticPaths, GetStaticProps } from 'next';
import ErrorPage from 'next/error';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { __URI__ } from '@utils/constants';
import { useRouter } from 'next/router';
import { generateAvatarURl, generateParsedStats, UserParsedStats } from '@modules/core/user/user';
import { CountryEntry } from '@typings/user.types';
import useAuth from '@contexts/UserContext';
import { initializeApollo } from '@modules/core/apollo/ssg-apollo';
import { gql } from '@apollo/client';

interface UserPageProps {
  /** Countries data */
  countries: CountryEntry[];
  targetUser: User;
  parsedStats: UserParsedStats;
}

const UserPage: React.FC<UserPageProps> = ({ countries, targetUser, parsedStats }) => {
  const router = useRouter();
  const usernameURI = router.query.name as string;
  const { user: loggedInUser } = useAuth();
  const [userOwnsPage, setUserOwnsPage] = useState(false);

  /** Check if the current logged user matches the target user. */
  useEffect(() => {
    if (loggedInUser && targetUser) {
      setUserOwnsPage(loggedInUser.username === usernameURI);
    }
  }, [targetUser, usernameURI, loggedInUser]);

  return (
    <LayoutCore
      headProps={{
        seoTitle: `${usernameURI} | Mecha Type`,
        seoDescription: `${usernameURI}´s profile page, showing their stats and more information.`,
        seoUrl: `${__URI__!}/user/${usernameURI}`,
        seoCanonicalUrl: `${__URI__!}/user`,
        seoImage: generateAvatarURl(targetUser),
      }}
    >
      {targetUser && (
        <UserProfile
          user={loggedInUser}
          targetUser={targetUser}
          loading={router.isFallback}
          ownsPage={userOwnsPage}
          parsedStats={parsedStats}
          countries={countries}
        />
      )}
    </LayoutCore>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale, params } = context;
  const client = initializeApollo();

  // Target user data fetch.
  const { data: userData } = await client.query<UserQuery, UserQueryVariables>({
    query: UserDocument,
    variables: {
      where: { username: params.name as string },
    },
  });

  // History presets data fetch.
  const { data: historyData } = await client.query<UserTestPresetsHistoryQuery, UserTestPresetsHistoryQueryVariables>({
    query: UserTestPresetsHistoryDocument,
    variables: {
      input: {
        username: params.name as string,
      },
    },
  });

  // Countries data fetch.
  let names: CountryEntry[] = [];
  await fetch('https://restcountries.com/v3.1/all')
    .then((response) => response.json())
    .then((data) =>
      data.map((country) => {
        names.push({ name: country.name.common, flag: country.flags.svg });
      })
    );

  // Found user and return the rest of props.
  if (userData.user.user) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['user-profile', 'sidebar'])),
        countries: names ?? [],
        targetUser: userData.user.user,
        parsedStats: generateParsedStats(historyData.userTestPresetsHistory.testPresetHistory),
      },
      revalidate: 60,
    };
  }

  // An error ocurred
  return {
    props: {},
    notFound: true,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const client = initializeApollo();

  const QUERY = gql`
    query users($take: Int) {
      users(take: $take) {
        users {
          username
        }
      }
    }
  `;

  // Fetch all users usernames.
  const { data: usersData } = await client.query<UsersQuery, UsersQueryVariables>({
    query: QUERY,
    variables: {},
  });

  const names = usersData.users.users.map((user) => ({ params: { name: user.username } }));

  return {
    fallback: true,
    paths: names,
  };
};

export default UserPage;
