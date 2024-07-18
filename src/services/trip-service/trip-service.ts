import { faker } from '@faker-js/faker';

import api from '@/config/api';

import type {
  CreateTripRequest,
  CreateTripResponse,
  GetTripByIdResponse,
  UpdateTripRequest,
} from './types';

class TripService {
  async create(request: CreateTripRequest) {
    const { data } = await api.post<CreateTripResponse>(`/trips`, {
      ...request,
      owner_email: faker.internet.email(),
      owner_name: faker.person.fullName(),
    });

    return data.tripId;
  }

  async getById(id: string) {
    const { data } = await api.get<GetTripByIdResponse>(`/trips/${id}`);

    return data.trip;
  }

  async update({ id, ...request }: UpdateTripRequest) {
    return api.put(`/trips/${id}`, request);
  }
}

export default new TripService();
