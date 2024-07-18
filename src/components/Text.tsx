import clsx from 'clsx';
import { Text as RNText, type TextProps } from 'react-native';

interface Props extends TextProps {
  bold?: boolean;
  variant?: 'body1' | 'body2' | 'title1' | 'title2';
}

export default function Text({
  bold,
  className,
  variant = 'body1',
  ...props
}: Props) {
  return (
    <RNText
      className={clsx(
        {
          'font-regular text-base text-zinc-400': variant === 'body1',
          'font-semibold text-2xl text-zinc-50': variant === 'title1',
          'font-semibold text-base text-zinc-100': variant === 'title2',
          'text-sm text-zinc-400': variant === 'body2',
        },
        {
          'font-semibold text-zinc-100': bold,
        },
        className,
      )}
      {...props}
    />
  );
}
