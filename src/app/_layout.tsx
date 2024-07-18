import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Slot } from 'expo-router';
import { StatusBar, View } from 'react-native';

import '@/config';
import '@/styles/global.css';

import Loading from '@/components/Loading';

export default function Layout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!loaded) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />

      <Slot />
    </View>
  );
}
