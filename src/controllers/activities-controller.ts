import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activity-service';

export async function getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const activities = await activitiesService.getActivities();

    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function getActivitiesDate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const date = await activitiesService.getActivitiesDate();

    return res.status(httpStatus.OK).send(date);
  } catch (error) {
    next(error);
  }
}

export async function UserSelectActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { activityId } = req.params;
  try {
    const select = await activitiesService.UserSelectActivity(userId, Number(activityId));

    return res.status(httpStatus.OK).send(select);
  } catch (error) {
    next(error);
  }
}
