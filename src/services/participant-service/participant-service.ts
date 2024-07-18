import api from '@/config/api';
import type {
  ConfirmTripByParticipantIdRequest,
  GetParticipantsByTripId,
} from '@/services/participant-service/types';

class ParticipantService {
  async confirmTripByParticipantId({
    participantId,
    ...request
  }: ConfirmTripByParticipantIdRequest) {
    await api.patch(`/participants/${participantId}/confirm`, request);
  }

  async getByTripId(tripId: string) {
    const { data } = await api.get<GetParticipantsByTripId>(
      `/trips/${tripId}/participants`,
    );

    return data.participants;
  }
}

export default new ParticipantService();
