import express from 'express';
import { userRouter } from './modules/users/user.routes';
import { authRouter } from './modules/auth/auth.routes';
import { eventRouter } from './modules/event/event.routes';

export const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use(authRouter);
