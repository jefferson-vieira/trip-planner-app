export interface Link {
  id: string;
  title: string;
  url: string;
}

export type LinkResponse = Link;

export interface CreateLinkRequest extends Omit<Link, 'id'> {
  tripId: string;
}

export interface CreateLinkResponse {
  linkId: string;
}

export interface GetLinksByTripId {
  links: LinkResponse[];
}
