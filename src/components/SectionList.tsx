import type { SectionListProps } from 'react-native';

import { SectionList as RNSectionList } from 'react-native';

import Loading from '@/components/Loading';

interface Props<T, S> extends SectionListProps<T, S> {
  loading?: boolean;
}

export default function SectionList<T, S>({ loading, ...props }: Props<T, S>) {
  if (loading) {
    return <Loading />;
  }

  return <RNSectionList {...props} />;
}
