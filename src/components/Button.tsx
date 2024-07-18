import type { LucideProps } from 'lucide-react-native';
import type { TextProps, TouchableOpacityProps } from 'react-native';

import clsx from 'clsx';
import { type ComponentType, createContext, useContext } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import styles from '@/styles';

interface StyleProps {
  variant: 'danger' | 'primary' | 'secondary';
}

export interface Props extends Partial<StyleProps>, TouchableOpacityProps {
  loading?: boolean;
}

const ThemeContext = createContext({} as StyleProps);

export default function Button({
  children,
  className,
  disabled,
  loading,
  variant = 'primary',
  ...props
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx(
        'h-11 flex-row items-center justify-center gap-2 rounded-lg px-2',
        {
          'bg-lime-300': variant === 'primary',
          'bg-red-400': variant === 'danger',
          'bg-zinc-800': variant === 'secondary',
          'opacity-50': disabled,
        },
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      <ThemeContext.Provider
        value={{
          variant,
        }}
      >
        {loading ? <ActivityIndicator className="text-lime-950" /> : children}
      </ThemeContext.Provider>
    </TouchableOpacity>
  );
}

interface ButtonIconProps {
  children?: never;
  icon: ComponentType<LucideProps>;
}

const ICON_COLOR_MAP: Record<
  Exclude<StyleProps['variant'], 'danger'>,
  string
> = {
  primary: styles.theme.colors.lime[950],
  secondary: styles.theme.colors.zinc[200],
};

function Icon({ icon: Icon }: ButtonIconProps) {
  const { variant } = useContext(ThemeContext);

  if (variant === 'danger') {
    throw new Error('Button.Icon: variant="danger" is not supported.');
  }

  return (
    <Icon
      color={ICON_COLOR_MAP[variant]}
      size={20}
    />
  );
}

function Title(props: TextProps) {
  const { variant } = useContext(ThemeContext);

  return (
    <Text
      className={clsx('font-semibold text-base', {
        'text-lime-950': variant === 'primary',
        'text-zinc-200': variant === 'secondary',
      })}
      {...props}
    />
  );
}

Button.Title = Title;
Button.Icon = Icon;
