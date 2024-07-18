import type { ModalProps } from 'react-native';

import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { Modal as RNModal, ScrollView, Text, View } from 'react-native';

import IconButton from '@/components/IconButton';

export interface Props extends ModalProps {
  onClose?: () => void;
  subtitle?: string;
  title: string;
}

export default function Modal({
  children,
  onClose,
  subtitle = '',
  title,
  ...rest
}: Props) {
  return (
    <RNModal
      animationType="slide"
      transparent
      {...rest}
    >
      <BlurView
        className="flex-1"
        experimentalBlurMethod="dimezisBlurView"
        intensity={7}
        tint="dark"
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="border-t border-zinc-700 bg-zinc-900 px-6 pb-10 pt-5">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center justify-between pt-5">
                <Text className="font-medium text-xl text-white">{title}</Text>

                {onClose && (
                  <IconButton
                    icon={X}
                    onPress={onClose}
                  />
                )}
              </View>

              {subtitle.trim().length > 0 && (
                <Text className="my-2 font-regular leading-6 text-zinc-400">
                  {subtitle}
                </Text>
              )}

              {children}
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </RNModal>
  );
}
