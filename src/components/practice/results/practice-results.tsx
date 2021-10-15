import React, { useState } from 'react';
import FiClock from '@meronex/icons/fi/FiClock';
import BiBullseye from '@meronex/icons/bi/BiBullseye';
import FaKeyboard from '@meronex/icons/fa/FaKeyboard';
import { ITypingStat, ETypingStatType } from '../game/types/practice-game';
import { ChartSelectButton, StatLineChart } from './charts';
import { UserStatCard } from '@components/user/profile/page/stats/user-stat-card';
import { Flex, Text, SimpleGrid, Button, Box, useColorModeValue } from '@chakra-ui/react';
import { StatDonutChart } from './charts/stat-donut-chart';

interface PracticeResultsProps {
  showStats?: boolean;
  keystrokes?: number;
  wordsPerMinute?: number;
  charsPerMinute?: number;
  correctChars?: number;
  incorrectChars?: number;
  spaceChars?: number;
  accuracy?: string;
  wordsWritten?: number;
  duration?: string;
  statsData: ITypingStat[];
}

const PracticeResults: React.FC<PracticeResultsProps> = ({
  showStats = false,
  keystrokes = 0,
  wordsPerMinute = 0,
  charsPerMinute = 0,
  correctChars = 0,
  incorrectChars = 0,
  spaceChars = 0,
  accuracy = '0%',
  wordsWritten = 0,
  duration = '0s',
  statsData,
}) => {
  const [currentGraph, setCurrentGraph] = useState<ETypingStatType>(ETypingStatType.WPM);

  return (
    <Flex
      flexDir="column"
      borderRadius="2xl"
      padding="1.5rem"
      backgroundColor={useColorModeValue('gray.300', 'gray.900')}
    >
      <Box>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" marginBottom="1.5rem">
          <Text as="h1" fontSize="3xl" color={useColorModeValue('black', 'white')} fontWeight={700}>
            Results
          </Text>
        </Flex>
        <SimpleGrid columns={[1, 1, 2, 3, 3]} spacing="0.5rem">
          <UserStatCard title="Keystrokes" amount={keystrokes.toString()} icon={FaKeyboard} backgroundColor="#075985" />
          <UserStatCard title="WPM" amount={wordsPerMinute.toString()} icon={FaKeyboard} backgroundColor="#1E40AF" />
          <UserStatCard title="CPM" amount={charsPerMinute.toString()} icon={FaKeyboard} backgroundColor="#3730A3" />
          <UserStatCard title="Accuracy" amount={accuracy} icon={BiBullseye} backgroundColor="#5B21B6" />
          <UserStatCard
            title="Words Written"
            amount={wordsWritten.toString()}
            icon={BiBullseye}
            backgroundColor="#6B21A8"
          />
          <UserStatCard title="Duration" amount={duration} icon={FiClock} backgroundColor="#86198F" />
        </SimpleGrid>
      </Box>
      <Box>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" marginTop="1.5rem" marginBottom="1.5rem">
          <Text as="h1" fontSize="3xl" color={useColorModeValue('black', 'white')} fontWeight={700}>
            Charts
          </Text>
          <Flex flexDir="row" justifyContent="space-between">
            <ChartSelectButton label={ETypingStatType.WPM} onClick={() => setCurrentGraph(ETypingStatType.WPM)} />
            <ChartSelectButton label={ETypingStatType.CPM} onClick={() => setCurrentGraph(ETypingStatType.CPM)} />
            <ChartSelectButton
              label={ETypingStatType.ACCURACY}
              onClick={() => setCurrentGraph(ETypingStatType.ACCURACY)}
            />
            <ChartSelectButton label={ETypingStatType.CHARS} onClick={() => setCurrentGraph(ETypingStatType.CHARS)} />
          </Flex>
        </Flex>
        <SimpleGrid columns={1} rows={1} spacing="0.5rem">
          {currentGraph !== ETypingStatType.CHARS && <StatLineChart statsData={statsData} statType={currentGraph} />}
          {currentGraph === ETypingStatType.CHARS && (
            <StatDonutChart statsData={statsData} statType={ETypingStatType.CHARS} />
          )}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default PracticeResults;
