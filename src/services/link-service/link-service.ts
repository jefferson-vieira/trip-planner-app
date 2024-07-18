import api from '@/config/api';

import type {
  CreateLinkRequest,
  CreateLinkResponse,
  GetLinksByTripId,
} from './types';

class LinkService {
  async create({ tripId, ...request }: CreateLinkRequest) {
    const { data } = await api.post<CreateLinkResponse>(
      `/trips/${tripId}/links`,
      request,
    );

    return data.linkId;
  }

  async getByTripId(tripId: string) {
    const { data } = await api.get<GetLinksByTripId>(`/trips/${tripId}/links`);

    return data.links;
  }
}

export default new LinkService();
