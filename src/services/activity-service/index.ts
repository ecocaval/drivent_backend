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

async function getActivitiesDate(id: number) {
  const date = await activitiesRepository.getActivitiesDate(id);
  if (!date) throw notFoundError();
  const month = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  let d;
  for (let i = 0; i < month.length; i++) {
    if (date.month == month[i]) d = i + 1;
  }
  return {
    id: date.id,
    weekDay: date.weekDay,
    month: d,
    monthDay: date.monthDay,
  };
}

const activitiesService = {
  getActivities,
  getActivitiesDate,
};

export default activitiesService;
