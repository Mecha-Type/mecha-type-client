import React from 'react';
import { UserFragment } from 'generated/graphql';
import { GetStaticProps } from 'next';
import { LeaderboardsDashboard } from '@components/leaderboards/leaderboards-dashboard';
import { __URI__ } from '@utils/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { withApollo } from '@modules/core/apollo/apollo';
import LayoutCore from 'layouts/core/components/layout-core';

interface LeaderboardsPageProps {
  /** Data containing the user info of the current logged in user. */
  me: UserFragment;
}

const LeaderboardsPage: React.FC<LeaderboardsPageProps> = ({ me }) => {
  return (
    <LayoutCore
      user={me}
      headProps={{
        seoTitle: 'Leaderboards | Mecha Type',
        seoDescription: 'Leaderboards of Mecha Type, see who is the best at typing!',
        seoUrl: `${__URI__}/leaderboards`,
      }}
    >
      <LeaderboardsDashboard />
    </LayoutCore>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  return { props: { locale, ...(await serverSideTranslations(locale ?? 'en', ['sidebar'])) } };
};

export default withApollo({})(LeaderboardsPage);
