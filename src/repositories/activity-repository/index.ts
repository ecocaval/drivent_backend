import { prisma } from '@/config';

async function getActivities() {
  return prisma.activity.findMany();
}

async function getActivitiesDate(id: number) {
  return prisma.activityDate.findUnique({ where: { id } });
}

const activitiesRepository = {
  getActivities,
  getActivitiesDate,
};

export default activitiesRepository;
