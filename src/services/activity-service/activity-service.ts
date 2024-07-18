import api from '@/config/api';

import type {
  CreateActivityRequest,
  CreateActivityResponse,
  GetActivitiesByTripIdResponse,
} from './types';

class ActivityService {
  async create({ tripId, ...request }: CreateActivityRequest) {
    const { data } = await api.post<CreateActivityResponse>(
      `/trips/${tripId}/activities`,
      request,
    );

    return data.activityId;
  }

  async getByTripId(tripId: string) {
    const { data } = await api.get<GetActivitiesByTripIdResponse>(
      `/trips/${tripId}/activities`,
    );

    return data.activities;
  }
}

export default new ActivityService();
