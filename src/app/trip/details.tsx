import { Link2, Plus, Tag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import linkService, { type Link } from '@/services/link-service';
import participantService, {
  type Participant,
} from '@/services/participant-service';
import type { TripResponse } from '@/services/trip-service';
import { validateInput } from '@/utils/validateInput';

import Button from '@/components/Button';
import FlatList from '@/components/FlatList';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Text from '@/components/Text';
import TripLink from '@/components/TripLink';
import TripParticipant from '@/components/TripParticipant';

interface Props {
  trip: TripResponse;
}

export function Details({ trip }: Props) {
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [links, setLinks] = useState<Link[]>([]);

  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [linkTitle, setLinkTitle] = useState('');
  const [linkURL, setLinkURL] = useState('');

  const [isCreatingLink, setIsCreatingLink] = useState(false);

  useEffect(() => {
    getLinks();

    getParticipants();
  }, []);

  async function getLinks() {
    setIsLoadingLinks(true);

    try {
      const links = await linkService.getByTripId(trip.id);

      setLinks(links);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingLinks(false);
    }
  }

  async function getParticipants() {
    setIsLoadingParticipants(true);

    try {
      const participants = await participantService.getByTripId(trip.id);

      setParticipants(participants);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingParticipants(false);
    }
  }

  async function handleCreateLink() {
    console.log('link', linkURL);

    if (!validateInput.url(linkURL)) {
      Alert.alert('Link', 'URL inválida!');

      return;
    }

    setIsCreatingLink(true);

    try {
      await linkService.create({
        title: linkTitle,
        tripId: trip.id,
        url: linkURL,
      });

      getLinks();

      Alert.alert('Link', 'Link criado com sucesso!');

      resetCreateLinkFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingLink(false);
    }
  }

  function resetCreateLinkFields() {
    setLinkTitle('');
    setLinkURL('');

    setShowModal(false);
  }

  const isCreateLinkButtonDisabled = !linkTitle.trim() || !linkURL.trim();

  return (
    <View className="mt-10 flex-1">
      <View className="flex-1">
        <Text
          className="mb-6"
          variant="title1"
        >
          Links importantes:
        </Text>

        <FlatList
          data={links}
          emptyText="Nenhum link adicionado."
          keyExtractor={({ id }) => id}
          loading={isLoadingLinks}
          renderItem={({ item }) => <TripLink data={item} />}
        />

        <Button
          variant="secondary"
          onPress={() => setShowModal(true)}
        >
          <Button.Icon icon={Plus} />

          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="mt-6 flex-1 border-t border-zinc-800">
        <Text
          className="my-6"
          variant="title1"
        >
          Convidados
        </Text>

        <FlatList
          contentContainerClassName="gap-4 pb-32"
          data={participants}
          keyExtractor={({ id }) => id}
          loading={isLoadingParticipants}
          renderItem={({ item }) => <TripParticipant data={item} />}
        />
      </View>

      <Modal
        subtitle="Todos convidados podem visualizar os links importantes."
        title="Cadastrar link"
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <View className="mb-3 gap-2">
          <Input>
            <Input.Icon icon={Tag} />

            <Input.Field
              placeholder="Título do link"
              value={linkTitle}
              onChangeText={setLinkTitle}
            />
          </Input>

          <Input>
            <Input.Icon icon={Link2} />

            <Input.Field
              placeholder="URL"
              value={linkURL}
              onChangeText={setLinkURL}
            />
          </Input>
        </View>

        <Button
          disabled={isCreateLinkButtonDisabled}
          loading={isCreatingLink}
          onPress={handleCreateLink}
        >
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
