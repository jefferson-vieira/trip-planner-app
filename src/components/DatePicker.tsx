import type { CalendarProps } from 'react-native-calendars';

import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import styles from '@/styles';
import { type DatesSelected, calendarUtils } from '@/utils/calendarUtils';
import { ptBR } from '@/utils/localeCalendarConfig';

import Button from '@/components/Button';
import Modal, { type Props as ModalProps } from '@/components/Modal';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

interface Props
  extends CalendarProps,
    Required<Pick<ModalProps, 'onClose' | 'subtitle' | 'title' | 'visible'>> {
  onChange: (date: DatesSelected) => void;
  value: DatesSelected | null;
}

export default function DatePicker({
  onChange,
  onClose,
  subtitle,
  title,
  value,
  visible,
  ...calendarProps
}: Props) {
  const handleDayPress: CalendarProps['onDayPress'] = (selectedDay) => {
    const date = calendarUtils.orderStartsAtAndEndsAt({
      endsAt: value?.endsAt,
      selectedDay,
      startsAt: value?.startsAt,
    });

    onChange(date);
  };

  const handleConfirmPress = () => {
    if (value?.startsAt && !value.endsAt) {
      onChange(
        calendarUtils.orderStartsAtAndEndsAt({
          selectedDay: value.startsAt,
          startsAt: value.startsAt,
        }),
      );
    }

    onClose();
  };

  return (
    <Modal
      subtitle={subtitle}
      title={title}
      visible={visible}
      onClose={onClose}
    >
      <View className="mt-4 gap-4">
        <Calendar
          hideExtraDays
          markedDates={value?.dates}
          style={{
            backgroundColor: 'transparent',
            borderRadius: 12,
            overflow: 'hidden',
          }}
          theme={{
            agendaDayNumColor: styles.theme.colors.zinc[200],
            arrowColor: styles.theme.colors.zinc[400],
            calendarBackground: 'transparent',
            monthTextColor: styles.theme.colors.zinc[200],
            selectedDayBackgroundColor: styles.theme.colors.lime[300],
            selectedDayTextColor: styles.theme.colors.zinc[900],
            textDayFontFamily: styles.theme.fontFamily.regular,
            textDayStyle: { color: styles.theme.colors.zinc[200] },
            textDisabledColor: styles.theme.colors.zinc[500],
            textMonthFontSize: 18,
            todayTextColor: styles.theme.colors.lime[300],
          }}
          onDayPress={handleDayPress}
          {...calendarProps}
        />

        <Button onPress={handleConfirmPress}>
          <Button.Title>Confirmar</Button.Title>
        </Button>
      </View>
    </Modal>
  );
}
