import dayjs from 'dayjs';
import { router } from 'expo-router';
import {
  ArrowRight,
  AtSign,
  Calendar,
  MapPin,
  Settings2,
  UserRoundPlus,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, Text, View } from 'react-native';

import tripService from '@/services/trip-service';
import { tripStorage } from '@/storage';
import styles from '@/styles';
import type { DatesSelected } from '@/utils/calendarUtils';
import { validateInput } from '@/utils/validateInput';

import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import GuestEmail from '@/components/GuestEmail';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';

const MIN_DESTINATION_LENGTH = 4;

enum FormStep {
  TRIP_DETAILS,
  ADD_EMAIL,
}

enum Modals {
  CALENDAR,
  GUESTS,
}

const NEXT_BUTTON_MAP = {
  [FormStep.ADD_EMAIL]: 'Confirmar viagem',
  [FormStep.TRIP_DETAILS]: 'Continuar',
};

export default function Index() {
  const [formStep, setFormStep] = useState(FormStep.TRIP_DETAILS);

  const [modalToShow, setModalToShow] = useState<Modals | null>(null);

  const [destination, setDestination] = useState('');
  const [tripDate, setTripDate] = useState<DatesSelected | null>(null);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  const [isGettingTrip, setIsGettingTrip] = useState(true);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  useEffect(() => {
    async function getTrip() {
      setIsGettingTrip(true);

      try {
        const tripId = await tripStorage.get();

        if (!tripId) {
          return;
        }

        goToTripPage(tripId);
      } catch (error) {
        console.log(error);
      } finally {
        setIsGettingTrip(false);
      }
    }

    getTrip();
  }, []);

  function handleInputTripDateClick() {
    if (formStep !== FormStep.TRIP_DETAILS) {
      return;
    }

    setModalToShow(Modals.CALENDAR);
  }

  function handleEmailAdd() {
    const email = emailToInvite.trim().toLowerCase();

    if (!validateInput.email(email)) {
      Alert.alert('Convidado', 'E-mail inválido!');

      return;
    }

    if (emailsToInvite.indexOf(email) !== -1) {
      Alert.alert('Convidado', 'E-mail já foi adicionado!');

      return;
    }

    setEmailsToInvite(emailsToInvite.concat(email));

    setEmailToInvite('');
  }

  function handleEmailRemove(email: string) {
    setEmailsToInvite(
      emailsToInvite.toSpliced(emailsToInvite.indexOf(email), 1),
    );
  }

  function handleNextStepForm() {
    if (!destination.trim() || !tripDate) {
      Alert.alert(
        'Detalhes da viagem',
        'Preencha todas as informações da viagem para seguir.',
      );

      return;
    }

    if (destination.length < MIN_DESTINATION_LENGTH) {
      Alert.alert(
        'Detalhes da viagem',
        `O destino deve ter pelo menos ${MIN_DESTINATION_LENGTH} caracteres.`,
      );

      return;
    }

    if (formStep === FormStep.TRIP_DETAILS) {
      setFormStep(FormStep.ADD_EMAIL);

      return;
    }

    Alert.alert('Nova viagem', 'Confirmar viagem?', [
      {
        style: 'cancel',
        text: 'Não',
      },
      {
        onPress: createTrip,
        text: 'Sim',
      },
    ]);
  }

  function handleModalClose() {
    setModalToShow(null);
  }

  async function createTrip() {
    setIsCreatingTrip(true);

    try {
      const tripId = await tripService.create({
        destination,
        emails_to_invite: emailsToInvite,
        ends_at: dayjs(tripDate!.endsAt!.dateString).toString(),
        starts_at: dayjs(tripDate!.startsAt!.dateString).toString(),
      });

      Alert.alert('Nova viagem', 'Viagem criada com sucesso!', [
        {
          onPress: () => saveTrip(tripId),
          text: 'OK. Continuar.',
        },
      ]);
    } catch (error) {
      Alert.alert('Nova viagem', 'Erro ao criar viagem!');

      console.log(error);

      setIsCreatingTrip(false);
    }
  }

  async function saveTrip(tripId: string) {
    try {
      await tripStorage.save(tripId);

      goToTripPage(tripId);
    } catch (error) {
      Alert.alert(
        'Salvar viagem',
        'Não foi possível salvar a viagem no dispositivo!',
      );

      console.log(error);

      setIsCreatingTrip(false);
    }
  }

  function goToTripPage(tripId: string) {
    router.navigate(`/trip/${tripId}`);
  }

  if (isGettingTrip) {
    return <Loading />;
  }

  const isInputtingTripDetails = formStep === FormStep.TRIP_DETAILS;

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image
        className="absolute"
        source={require('@/assets/bg.png')}
      />

      <Image
        className="h-8"
        resizeMode="contain"
        source={require('@/assets/logo.png')}
      />

      <Text className="mt-3 text-center font-regular text-lg text-zinc-400">
        Convide seus amigos e planeje sua próxima viagem!
      </Text>

      <View className="my-8 w-full gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <Input>
          <Input.Icon icon={MapPin} />

          <Input.Field
            editable={isInputtingTripDetails}
            placeholder="Para onde?"
            value={destination}
            onChangeText={setDestination}
          />
        </Input>

        <Input>
          <Input.Icon icon={Calendar} />

          <Input.Field
            editable={isInputtingTripDetails}
            placeholder="Quando?"
            showSoftInputOnFocus={false}
            value={tripDate?.formatDatesInText || ''}
            onFocus={Keyboard.dismiss}
            onPressIn={handleInputTripDateClick}
          />
        </Input>

        {formStep === FormStep.ADD_EMAIL ? (
          <>
            <View className="border-b border-zinc-800 py-3">
              <Button
                variant="secondary"
                onPress={() => setFormStep(FormStep.TRIP_DETAILS)}
              >
                <Button.Title>Alterar local/data</Button.Title>

                <Button.Icon icon={Settings2} />
              </Button>
            </View>

            <Input>
              <Input.Icon icon={UserRoundPlus} />

              <Input.Field
                autoCorrect={false}
                caretHidden
                placeholder="Quem estará na viagem?"
                showSoftInputOnFocus={false}
                value={
                  emailsToInvite.length
                    ? `${emailsToInvite.length} pessoa(s) convidada(s)`
                    : ''
                }
                onFocus={Keyboard.dismiss}
                onPressIn={() => setModalToShow(Modals.GUESTS)}
              />
            </Input>
          </>
        ) : null}

        <Button
          loading={isCreatingTrip}
          onPress={handleNextStepForm}
        >
          <Button.Title>{NEXT_BUTTON_MAP[formStep]}</Button.Title>

          <ArrowRight
            color={styles.theme.colors.lime[950]}
            size={20}
          />
        </Button>
      </View>

      <Text className="text-center font-regular text-base text-zinc-500">
        {/* eslint-disable react/jsx-newline */}
        Ao planejar sua viagem pela plann.er você automaticamente concorda com
        nossos <Text className="text-zinc-300 underline">
          termos de uso
        </Text> e{' '}
        <Text className="text-zinc-300 underline">
          políticas de privacidade
        </Text>
        .{/* eslint-enable */}
      </Text>

      <DatePicker
        minDate={dayjs().toISOString()}
        subtitle="Selecione a data de ida e volta  da viagem"
        title="Selecionar datas"
        value={tripDate}
        visible={modalToShow === Modals.CALENDAR}
        onChange={setTripDate}
        onClose={handleModalClose}
      />

      <Modal
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        title="Selecionar convidados"
        visible={modalToShow === Modals.GUESTS}
        onClose={handleModalClose}
      >
        <View className="my-2 flex-wrap items-start gap-2 border-b border-zinc-800 py-5">
          {emailsToInvite.length ? (
            emailsToInvite.map((email) => (
              <GuestEmail
                email={email}
                key={email}
                onRemove={() => handleEmailRemove(email)}
              />
            ))
          ) : (
            <Text className="font-regular text-base text-zinc-600">
              Nenhum e-mail adicionado.
            </Text>
          )}
        </View>

        <View className="mt-4 gap-4">
          <Input variant="secondary">
            <Input.Icon icon={AtSign} />

            <Input.Field
              keyboardType="email-address"
              placeholder="Digite o e-mail do convidado"
              returnKeyType="send"
              value={emailToInvite}
              onChangeText={setEmailToInvite}
              onSubmitEditing={handleEmailAdd}
            />
          </Input>

          <Button
            disabled={!emailToInvite.trim().length}
            onPress={handleEmailAdd}
          >
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
