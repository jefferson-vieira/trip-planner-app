import { CircleCheck, CircleDashed } from 'lucide-react-native';
import { Text, View } from 'react-native';

import type { Participant } from '@/services/participant-service';
import styles from '@/styles';

interface Props {
  data: Participant;
}

export default function TripParticipant({ data }: Props) {
  return (
    <View className="w-full flex-row items-center">
      <View className="flex-1">
        <Text className="font-semibold text-base text-zinc-100">
          {data.name ?? 'Pendente'}
        </Text>

        <Text className="text-sm text-zinc-400">{data.email}</Text>
      </View>

      {data.is_confirmed ? (
        <CircleCheck
          color={styles.theme.colors.lime[300]}
          size={20}
        />
      ) : (
        <CircleDashed
          color={styles.theme.colors.zinc[400]}
          size={20}
        />
      )}
    </View>
  );
}
