import type { LucideProps } from 'lucide-react-native';
import type { ComponentType } from 'react';

import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import styles from '@/styles';

type Props = {
  children?: never;
  icon: ComponentType<LucideProps>;
} & TouchableOpacityProps;

export default function IconButton({ icon: Icon, ...props }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
    >
      <Icon
        color={styles.theme.colors.zinc[400]}
        size={20}
      />
    </TouchableOpacity>
  );
}
