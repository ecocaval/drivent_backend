import { prisma } from '@/config';

async function getActivities() {
  return prisma.activity.findMany();
}

async function getActivitiesDate() {
  return prisma.activityDate.findMany();
}

const activitiesRepository = {
  getActivities,
  getActivitiesDate,
};

export default activitiesRepository;
