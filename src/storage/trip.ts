import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIP_STORAGE_KEY = '@planner:tripId';

export function save(tripId: string) {
  return AsyncStorage.setItem(TRIP_STORAGE_KEY, tripId);
}

export function get() {
  return AsyncStorage.getItem(TRIP_STORAGE_KEY);
}

export function remove() {
  return AsyncStorage.removeItem(TRIP_STORAGE_KEY);
}
