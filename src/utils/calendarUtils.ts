import type { Dayjs } from 'dayjs';
import type { DateData } from 'react-native-calendars';
import type { MarkedDates } from 'react-native-calendars/src/types';

import dayjs from 'dayjs';
import { CalendarUtils } from 'react-native-calendars';

type OrderStartsAtAndEndsAt =
  | {
      endsAt: string;
      selectedDay?: never;
      startsAt: string;
    }
  | {
      endsAt?: DateData;
      selectedDay: DateData;
      startsAt?: DateData;
    };

type FormatDatesInText = {
  endsAt: Dayjs;
  startsAt: Dayjs;
};

export type DatesSelected = {
  dates: MarkedDates;
  endsAt: DateData | undefined;
  formatDatesInText: string;
  startsAt: DateData | undefined;
};

function orderStartsAtAndEndsAt({
  endsAt,
  selectedDay,
  startsAt,
}: OrderStartsAtAndEndsAt): DatesSelected {
  if (!selectedDay) {
    return {
      dates: getIntervalDates(startsAt, endsAt),
      endsAt: CalendarUtils.getCalendarDateString(endsAt),
      formatDatesInText: formatDatesInText({
        endsAt: dayjs(endsAt),
        startsAt: dayjs(startsAt),
      }),
      startsAt: CalendarUtils.getCalendarDateString(startsAt),
    };
  }

  if (!startsAt) {
    return {
      dates: getIntervalDates(selectedDay, selectedDay),
      endsAt: undefined,
      formatDatesInText: '',
      startsAt: selectedDay,
    };
  }

  if (startsAt && endsAt) {
    return {
      dates: getIntervalDates(selectedDay, selectedDay),
      endsAt: undefined,
      formatDatesInText: '',
      startsAt: selectedDay,
    };
  }

  if (selectedDay.timestamp <= startsAt.timestamp) {
    return {
      dates: getIntervalDates(selectedDay, startsAt),
      endsAt: startsAt,
      formatDatesInText: formatDatesInText({
        endsAt: dayjs(startsAt.dateString),
        startsAt: dayjs(selectedDay.dateString),
      }),
      startsAt: selectedDay,
    };
  }

  return {
    dates: getIntervalDates(startsAt, selectedDay),
    endsAt: selectedDay,
    formatDatesInText: formatDatesInText({
      endsAt: dayjs(selectedDay.dateString),
      startsAt: dayjs(startsAt.dateString),
    }),
    startsAt: startsAt,
  };
}

function formatDatesInText({ endsAt, startsAt }: FormatDatesInText) {
  const FORMAT_PATTERN = 'DD[ de ]MMMM';

  const endsAtFormatted = endsAt.format(FORMAT_PATTERN);

  if (startsAt.isSame(endsAt)) {
    return endsAtFormatted;
  }

  const formatted = `${startsAt.format(FORMAT_PATTERN)} à ${endsAtFormatted}`;

  return formatted;
}

function getIntervalDates(startsAt: string, endsAt: string): MarkedDates;
function getIntervalDates(startsAt: DateData, endsAt: DateData): MarkedDates;
function getIntervalDates(startsAt: unknown, endsAt: unknown): MarkedDates {
  const start = dayjs(
    typeof startsAt === 'string' ? startsAt : (startsAt as DateData).dateString,
  );
  const end = dayjs(
    typeof endsAt === 'string' ? endsAt : (endsAt as DateData).dateString,
  );

  let currentDate = start;
  const datesArray: string[] = [];

  while (currentDate.isBefore(end) || currentDate.isSame(end)) {
    datesArray.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }

  let interval: MarkedDates = {};

  datesArray.forEach((date) => {
    interval = {
      ...interval,
      [date]: {
        selected: true,
      },
    };
  });

  return interval;
}

export const calendarUtils = {
  dateToCalendarDate: CalendarUtils.getCalendarDateString,
  formatDatesInText,
  orderStartsAtAndEndsAt,
};
