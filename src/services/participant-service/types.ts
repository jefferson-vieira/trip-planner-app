export interface Participant {
  email: string;
  id: string;
  is_confirmed: boolean;
  name: string;
}

export type ParticipantResponse = Participant;

export interface ConfirmTripByParticipantIdRequest
  extends Pick<Participant, 'email' | 'name'> {
  participantId: string;
}

export interface CreateParticipantResponse {
  participantId: string;
}

export interface GetParticipantsByTripId {
  participants: ParticipantResponse[];
}
