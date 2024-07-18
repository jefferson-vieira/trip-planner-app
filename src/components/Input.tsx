import type { LucideProps } from 'lucide-react-native';
import type { ComponentType, ReactNode } from 'react';
import type { TextInputProps } from 'react-native';

import clsx from 'clsx';
import { TextInput, View } from 'react-native';

import styles from '@/styles';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export default function Input({ children, variant = 'primary' }: Props) {
  return (
    <View
      className={clsx('h-16 w-full flex-row items-center gap-2', {
        'bg-zinc-900': variant === 'tertiary',
        'bg-zinc-950': variant === 'secondary',
        'border-zinc -800 h-14 rounded-lg border px-4': variant !== 'primary',
      })}
    >
      {children}
    </View>
  );
}

function Field(props: TextInputProps) {
  const inputCursorColor = styles.theme.colors.zinc[100];

  return (
    <TextInput
      className="flex-1 font-regular text-lg text-zinc-100"
      cursorColor={inputCursorColor}
      placeholderTextColor={styles.theme.colors.zinc[400]}
      selectionColor={inputCursorColor}
      {...props}
    />
  );
}

interface InputIconProps {
  children?: never;
  icon: ComponentType<LucideProps>;
}

function Icon({ icon: Icon }: InputIconProps) {
  return (
    <Icon
      color={styles.theme.colors.zinc[400]}
      size={20}
    />
  );
}

Input.Field = Field;
Input.Icon = Icon;
