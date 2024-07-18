import clsx from 'clsx';
import { CircleCheck, CircleDashed } from 'lucide-react-native';
import { Text, View } from 'react-native';

import styles from '@/styles';

export interface IActivity {
  hour: string;
  id: string;
  isBefore: boolean;
  title: string;
}

export interface Props {
  data: IActivity;
}

export default function TripActivity({ data }: Props) {
  return (
    <View
      className={clsx(
        'w-full flex-row items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3',
        {
          'opacity-50': data.isBefore,
        },
      )}
    >
      {data.isBefore ? (
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

      <Text className="flex-1 font-regular text-base text-zinc-100">
        {data.title}
      </Text>

      <Text className="font-regular text-sm text-zinc-400">{data.hour}</Text>
    </View>
  );
}
