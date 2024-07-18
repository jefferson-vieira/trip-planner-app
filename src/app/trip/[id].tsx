import type { DateData } from 'react-native-calendars';

import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Calendar,
  CalendarRange,
  Info,
  MapPin,
  Settings2,
  User,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, View } from 'react-native';

import participantService from '@/services/participant-service';
import tripService, { type TripResponse } from '@/services/trip-service';
import { tripStorage } from '@/storage';
import { type DatesSelected, calendarUtils } from '@/utils/calendarUtils';
import { validateInput } from '@/utils/validateInput';

import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Text from '@/components/Text';

import { Activities } from './activities';
import { Details } from './details';

const WHEN_DATE_FORMAT_PATTERN = 'DD [de] MMM[.]';

enum Tab {
  ACTIVITIES,
  DETAILS,
}

enum Modals {
  CALENDAR,
  UPDATE_TRIP,
  CONFIRM_ATTENDANCE,
}

export default function Trip() {
  const { id: tripId, participantId } = useLocalSearchParams<{
    id: string;
    participantId: string;
  }>();

  const [isLoadingTrip, setIsLoadingTrip] = useState(true);

  const [trip, setTrip] = useState<TripResponse>();

  const [tab, setTab] = useState(Tab.DETAILS);

  const [modalToShow, setModalToShow] = useState<Modals | null>(
    participantId ? Modals.CONFIRM_ATTENDANCE : null,
  );

  const [destination, setDestination] = useState('');
  const [tripDate, setTripDate] = useState<DatesSelected | null>(null);

  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false);

  useEffect(() => {
    getTrip();
  }, []);

  async function getTrip() {
    if (!tripId) {
      router.back();

      return;
    }

    setIsLoadingTrip(true);
    setModalToShow(null);

    try {
      const trip = await tripService.getById(tripId);

      setTrip(trip);

      setDestination(trip.destination);
      setTripDate(
        calendarUtils.orderStartsAtAndEndsAt({
          endsAt: trip.ends_at,
          startsAt: trip.starts_at,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTrip(false);
    }
  }

  function handleTripDatePick(selectedDay: DateData) {
    const date = calendarUtils.orderStartsAtAndEndsAt({
      endsAt: tripDate?.endsAt,
      selectedDay: selectedDay,
      startsAt: tripDate?.startsAt,
    });

    setTripDate(date);
  }

  async function handleUpdateTrip() {
    setIsUpdatingTrip(true);

    try {
      await tripService.update({
        destination,
        ends_at: dayjs(tripDate!.endsAt!.dateString).toString(),
        id: trip!.id,
        starts_at: dayjs(tripDate!.startsAt!.dateString).toString(),
      });

      Alert.alert('Atualizar viagem', 'Viagem atualizada com sucesso!', [
        {
          onPress: getTrip,
          text: 'OK',
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingTrip(false);
    }
  }

  async function handleConfirmAttendance() {
    if (!validateInput.email(guestEmail)) {
      Alert.alert('Confirmar presença', 'E-mail inválido!');

      return;
    }

    setIsConfirmingAttendance(true);

    try {
      await participantService.confirmTripByParticipantId({
        email: guestEmail,
        name: guestName,
        participantId: participantId!,
      });

      await tripStorage.save(tripId!);

      Alert.alert('Confirmação de presença', 'Viagem confirmada com sucesso!');

      resetConfirmAttendanceFields();
    } catch (error) {
      Alert.alert(
        'Confirmação de presença',
        'Não foi possível confirmar sua presença!',
      );

      console.log(error);
    } finally {
      setIsConfirmingAttendance(false);
    }
  }

  function resetConfirmAttendanceFields() {
    setGuestName('');
    setGuestEmail('');

    handleModalClose();
  }

  function handleCancelAttendance() {
    Alert.alert('Remover viagem', 'Tem certeza que deseja remover a viagem?', [
      {
        style: 'cancel',
        text: 'Não',
      },
      {
        onPress: cancelAttendance,
        text: 'Sim',
      },
    ]);
  }

  async function cancelAttendance() {
    try {
      await tripStorage.remove();

      router.navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  function handleModalClose() {
    setModalToShow(null);
  }

  if (isLoadingTrip) {
    return <Loading />;
  }

  if (!trip) {
    return;
  }

  const when = `${trip.destination}, ${dayjs(trip.starts_at).format(WHEN_DATE_FORMAT_PATTERN)} à ${dayjs(trip.ends_at).format(WHEN_DATE_FORMAT_PATTERN)}`;

  const activeThisTab = (thisTab: Tab) =>
    tab === thisTab ? 'primary' : 'secondary';

  const isConfirmingAttendanceButtonDisabled =
    !guestName.trim() || !guestEmail.trim();

  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <Input.Icon icon={MapPin} />

        <Input.Field
          readOnly
          value={when}
        />

        <IconButton
          className="h-9 w-9 items-center justify-center rounded bg-zinc-800"
          icon={Settings2}
          onPress={() => setModalToShow(Modals.UPDATE_TRIP)}
        />
      </Input>

      {tab === Tab.ACTIVITIES && <Activities trip={trip} />}

      {tab === Tab.DETAILS && <Details trip={trip} />}

      <View className="absolute -bottom-1 z-10 w-full justify-end self-center bg-zinc-950 pb-5">
        <View className="w-full flex-row gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <Button
            className="flex-1"
            variant={activeThisTab(Tab.ACTIVITIES)}
            onPress={() => setTab(Tab.ACTIVITIES)}
          >
            <Button.Icon icon={CalendarRange} />

            <Button.Title>Atividades</Button.Title>
          </Button>

          <Button
            className="flex-1"
            variant={activeThisTab(Tab.DETAILS)}
            onPress={() => setTab(Tab.DETAILS)}
          >
            <Button.Icon icon={Info} />

            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        subtitle="Somente quem criou a viagem pode editar."
        title="Atualizar viagem"
        visible={modalToShow === Modals.UPDATE_TRIP}
        onClose={handleModalClose}
      >
        <View className="my-4 gap-2">
          <Input variant="secondary">
            <Input.Icon icon={MapPin} />

            <Input.Field
              placeholder="Para onde?"
              value={destination}
              onChangeText={setDestination}
            />
          </Input>

          <Input variant="secondary">
            <Input.Icon icon={Calendar} />

            <Input.Field
              caretHidden
              placeholder="Quando?"
              showSoftInputOnFocus={false}
              value={tripDate?.formatDatesInText || ''}
              onFocus={Keyboard.dismiss}
              onPressIn={() => setModalToShow(Modals.CALENDAR)}
            />
          </Input>

          <Button
            disabled={!destination || !tripDate}
            loading={isUpdatingTrip}
            onPress={handleUpdateTrip}
          >
            <Button.Title>Atualizar</Button.Title>
          </Button>

          <Button
            loading={isUpdatingTrip}
            variant="danger"
            onPress={handleCancelAttendance}
          >
            <Button.Title>Sair da viagem</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        subtitle="Selecione a data de ida e volta  da viagem"
        title="Selecionar datas"
        visible={modalToShow === Modals.CALENDAR}
        onClose={handleModalClose}
      >
        <View className="mt-4 gap-4">
          <DatePicker
            markedDates={tripDate?.dates}
            minDate={dayjs().toISOString()}
            onDayPress={handleTripDatePick}
          />

          <Button onPress={() => setModalToShow(Modals.UPDATE_TRIP)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        visible={modalToShow === Modals.CONFIRM_ATTENDANCE}
      >
        <View className="mt-4 gap-4">
          <Text className="my-2 leading-6">
            {/* eslint-disable react/jsx-newline */}
            Você foi convidado(a) para participar de uma viagem para{' '}
            <Text bold>{trip.destination}</Text> nas datas de{' '}
            <Text bold>{dayjs(trip.starts_at).date()}</Text> a{' '}
            <Text bold>{dayjs(trip.ends_at).format('DD[ de ]MMMM')}</Text>. Para
            confirmar sua presença na viagem, preencha os dados abaixo:
            {/* eslint-enabled */}
          </Text>

          <Input variant="secondary">
            <Input.Icon icon={User} />

            <Input.Field
              placeholder="Nome completo"
              value={guestName}
              onChangeText={setGuestName}
            />
          </Input>

          <Input variant="secondary">
            <Input.Icon icon={User} />

            <Input.Field
              keyboardType="email-address"
              placeholder="E-mail de confirmação"
              value={guestEmail}
              onChangeText={setGuestEmail}
            />
          </Input>

          <Button
            disabled={isConfirmingAttendanceButtonDisabled}
            loading={isConfirmingAttendance}
            onPress={handleConfirmAttendance}
          >
            <Button.Title>Confirmar minha presença</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
