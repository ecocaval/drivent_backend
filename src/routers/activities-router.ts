import { Router } from 'express';
import { getActivities, getActivitiesDate } from '@/controllers';

const activitiesRouter = Router();

activitiesRouter.get('/', getActivities).get('/dates/:id', getActivitiesDate);

export { activitiesRouter };
