import type { FlatListProps } from 'react-native';

import { FlatList as RNFlatList } from 'react-native';

import Loading from '@/components/Loading';
import Text from '@/components/Text';

interface Props<T> extends FlatListProps<T> {
  emptyText?: string;
  loading?: boolean;
}

export default function FlatList<T>({
  data,
  emptyText,
  loading,
  ...props
}: Props<T>) {
  if (loading) {
    return <Loading />;
  }

  if (emptyText && data?.length === 0) {
    return <Text className="mb-6 mt-2">{emptyText}</Text>;
  }

  return (
    <RNFlatList
      data={data}
      {...props}
    />
  );
}
