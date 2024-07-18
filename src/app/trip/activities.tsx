import dayjs from 'dayjs';
import { Calendar, Clock, PlusIcon, Tag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, Text, View } from 'react-native';

import activityService from '@/services/activity-service';
import type { TripResponse } from '@/services/trip-service';

import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import SectionList from '@/components/SectionList';
import TripActivity, {
  type Props as ActivityProps,
} from '@/components/TripActivity';

interface IActivity {
  data: ActivityProps['data'][];
  title: {
    dayLabel: string;
    dayNumber: number;
  };
}

enum Modals {
  CALENDAR,
  NEW_ACTIVITY,
}

interface Props {
  trip: TripResponse;
}

export function Activities({ trip }: Props) {
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activities, setActivities] = useState<IActivity[]>([]);

  const [modalToShow, setModalToShow] = useState<Modals | null>(null);

  const [activityTitle, setActivityTitle] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('');

  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  useEffect(() => {
    getActivities();
  }, []);

  async function getActivities() {
    setIsLoadingActivities(true);

    try {
      const activities = await activityService.getByTripId(trip.id);

      const activitiesToSectionList = activities.map<IActivity>((activity) => {
        const activityDate = dayjs(activity.date);

        return {
          data: activity.activities.map((activity) => {
            const occursAtDate = dayjs(activity.occurs_at);

            return {
              ...activity,
              hour: occursAtDate.format('hh[:]mm[h]'),
              isBefore: occursAtDate.isBefore(dayjs()),
            };
          }),
          title: {
            dayLabel: activityDate.format('[de] MMMM[, ]dddd'),
            dayNumber: activityDate.date(),
          },
        };
      });

      setActivities(activitiesToSectionList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingActivities(false);
    }
  }

  function handleCreateActivityPress() {
    setModalToShow(Modals.NEW_ACTIVITY);
  }

  function handleModalClose() {
    setModalToShow(null);
  }

  async function handleCreateActivity() {
    if (!activityTitle || !activityDate || !activityTime) {
      Alert.alert('Cadastrar atividade', 'Preencha todos os campos!');

      return;
    }

    setIsCreatingActivity(true);

    try {
      await activityService.create({
        occurs_at: dayjs(activityDate)
          .add(Number(activityTime), 'h')
          .toString(),
        title: activityTitle,
        tripId: trip.id,
      });

      getActivities();

      Alert.alert('Nova atividade', 'Nova atividade cadastrada com sucesso!');

      resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingActivity(false);
    }
  }

  function resetFields() {
    setActivityTitle('');
    setActivityDate('');
    setActivityTime('');
  }

  return (
    <View className="flex-1">
      <View className="mb-6 mt-5 w-full flex-row items-center">
        <Text className="flex-1 font-semibold text-2xl text-zinc-50">
          Atividades: {trip.destination}
        </Text>

        <Button onPress={handleCreateActivityPress}>
          <Button.Icon icon={PlusIcon} />

          <Button.Title>Nova atividade</Button.Title>
        </Button>
      </View>

      <SectionList
        contentContainerClassName="gap-3 pb-48"
        keyExtractor={({ id }) => id}
        loading={isLoadingActivities}
        renderItem={({ item }) => <TripActivity data={item} />}
        renderSectionHeader={({ section }) => (
          <View className="w-full">
            <Text className="py-2 font-semibold text-2xl text-zinc-50">
              {/* eslint-disable react/jsx-newline */}
              Dia {section.title.dayNumber}{' '}
              <Text className="font-regular text-base capitalize text-zinc-500">
                {section.title.dayLabel}
              </Text>
              {/* eslint-enable */}
            </Text>

            {section.data.length ? null : (
              <Text className="mb-8 font-regular text-sm text-zinc-500">
                Nenhum atividade cadastrada nessa data.
              </Text>
            )}
          </View>
        )}
        sections={activities}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        subtitle="Todos convidados podem visualizar as atividades."
        title="Cadastrar atividade"
        visible={modalToShow === Modals.NEW_ACTIVITY}
        onClose={handleModalClose}
      >
        <View className="mb-3 mt-4">
          <Input variant="secondary">
            <Input.Icon icon={Tag} />

            <Input.Field
              placeholder="Qual atividade?"
              value={activityTitle}
              onChangeText={setActivityTitle}
            />
          </Input>

          <View className="mt-2 w-full flex-row gap-2">
            <Input variant="secondary">
              <Input.Icon icon={Calendar} />

              <Input.Field
                placeholder="Dia?"
                showSoftInputOnFocus={false}
                value={dayjs(activityDate).format('DD [de] MMMM')}
                onChangeText={setActivityDate}
                onFocus={Keyboard.dismiss}
                onPressIn={() => setModalToShow(Modals.CALENDAR)}
              />
            </Input>

            <Input variant="secondary">
              <Input.Icon icon={Clock} />

              <Input.Field
                keyboardType="numeric"
                maxLength={2}
                placeholder="Horário?"
                value={activityTime}
                onChangeText={setActivityTime}
              />
            </Input>
          </View>
        </View>

        <Button
          loading={isCreatingActivity}
          onPress={handleCreateActivity}
        >
          <Button.Title>Salvar atividade</Button.Title>
        </Button>
      </Modal>

      <DatePicker
        initialDate={trip.starts_at}
        markedDates={{ [activityDate]: { selected: true } }}
        maxDate={trip.ends_at}
        minDate={trip.starts_at}
        subtitle="Selecione a data da atividade"
        title="Selecionar data"
        visible={modalToShow === Modals.CALENDAR}
        onClose={handleModalClose}
        onChange={() => setModalToShow(Modals.NEW_ACTIVITY)}
        onDayPress={(day) => setActivityDate(day.dateString)}
      />
    </View>
  );
}
