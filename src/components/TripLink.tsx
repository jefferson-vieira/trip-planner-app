import { openURL } from 'expo-linking';
import { Link2 } from 'lucide-react-native';
import { View } from 'react-native';

import type { Link } from '@/services/link-service';

import IconButton from '@/components/IconButton';
import Text from '@/components/Text';

interface Props {
  data: Link;
}

export default function TripLink({ data }: Props) {
  function handleLinkOpen() {
    openURL(data.url);
  }

  return (
    <View className="w-full flex-row items-center gap-4">
      <View className="flex-1">
        <Text variant="title2">{data.title}</Text>

        <Text
          numberOfLines={1}
          variant="body2"
        >
          {data.url}
        </Text>
      </View>

      <IconButton
        icon={Link2}
        onPress={handleLinkOpen}
      />
    </View>
  );
}
