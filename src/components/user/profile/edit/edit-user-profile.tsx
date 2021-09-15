import React from 'react';
import { User } from 'generated/graphql';
import { Flex, Text, GridItem, Grid, useColorModeValue } from '@chakra-ui/react';
import { UserAvatar } from '../page/user/user-avatar';
import { EditUserProfileForm } from './edit-user-profile-form';
import { useSession } from 'next-auth/react';
import { CountryEntry } from '@pages/user/[id]';

interface EditUserProfileProps {
  /** User to perform the edits */
  user: User;
  /** Wether content is loading or not */
  loading: boolean;
  /** Method to call when data was updated */
  onUpdatedCallback: () => void;
  /** Countries data */
  countries: CountryEntry[];
}

export const EditUserProfile: React.FC<EditUserProfileProps> = ({ user, loading, onUpdatedCallback, countries }) => {
  const { data: session } = useSession();
  const topBg = useColorModeValue('gray.300', 'gray.700');
  const textColor = useColorModeValue('black', 'white');

  if (user.email !== session?.user?.email) {
    return <Text as="h2">UN AUTHORIZED</Text>;
  }

  return (
    <Grid
      templateRows="1fr"
      templateColumns="1fr auto"
      padding="1rem"
      borderRadius="2xl"
      boxShadow="xl"
      justifyContent="space-between"
      backgroundColor={topBg}
    >
      <GridItem rowSpan={2} pr={4}>
        <Flex flexDir="column">
          <Flex maxWidth="3xl">
            <EditUserProfileForm user={user} onUpdatedCallback={onUpdatedCallback} countries={countries} />
          </Flex>
        </Flex>
      </GridItem>
      <GridItem display="flex">
        <UserAvatar imageUrl={user?.image!} size={150} loading={loading} />
      </GridItem>
    </Grid>
  );
};
