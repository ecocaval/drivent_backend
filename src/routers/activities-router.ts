import { Router } from 'express';
import { getActivities, getActivitiesDate, UserSelectActivity } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const activitiesRouter = Router();

activitiesRouter
  .get('/', getActivities)
  .get('/dates', getActivitiesDate)
  .post('/select/:activityId', authenticateToken, UserSelectActivity);

export { activitiesRouter };
