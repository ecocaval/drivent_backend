import { UserActivity } from '@prisma/client';
import { prisma } from '@/config';

async function getActivities() {
  return prisma.activity.findMany();
}

async function getActivitiesDate() {
  return prisma.activityDate.findMany();
}

async function UserSelectActivity(data: Omit<UserActivity, 'id'>) {
  return prisma.userActivity.create({ data });
}

const activitiesRepository = {
  getActivities,
  getActivitiesDate,
  UserSelectActivity,
};

export default activitiesRepository;
