import { Router } from 'express';
import { singInPost, signInGitHub } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in/github', signInGitHub);
authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);

export { authenticationRouter };
