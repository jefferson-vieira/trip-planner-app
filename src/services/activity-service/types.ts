export interface Activity {
  id: string;
  occurs_at: string;
  title: string;
}

export type ActivityResponse = Activity;

export interface CreateActivityRequest extends Omit<Activity, 'id'> {
  tripId: string;
}

export interface CreateActivityResponse {
  activityId: string;
}

export interface GetActivitiesByTripIdResponse {
  activities: {
    activities: ActivityResponse[];
    date: string;
  }[];
}
