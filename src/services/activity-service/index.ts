import { notFoundError } from '@/errors';
import activitiesRepository from '@/repositories/activity-repository';

async function getActivities() {
  const activities = await activitiesRepository.getActivities();

  if (!activities) throw notFoundError();

  for (let i = 0; i < activities.length; i++) {
    delete activities[i].createdAt;
    delete activities[i].updatedAt;
  }

  return activities;
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
