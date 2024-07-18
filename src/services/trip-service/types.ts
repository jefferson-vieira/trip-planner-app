export interface TripResponse {
  destination: string;
  ends_at: string;
  id: string;
  is_confirmed: string;
  starts_at: string;
}

export type CreateTripRequest = {
  emails_to_invite: string[];
} & Omit<TripResponse, 'id' | 'is_confirmed'>;

export interface CreateTripResponse {
  tripId: string;
}

export interface GetTripByIdResponse {
  trip: TripResponse;
}

export type UpdateTripRequest = Omit<TripResponse, 'is_confirmed'>;
