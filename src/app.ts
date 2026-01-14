import express from 'express';

import { userRouter } from './modules/users/user.routes';
import { authRouter } from './modules/auth/auth.routes';
import { eventRouter } from './modules/event/event.routes';
import { rideRouter } from './modules/ride/ride.routes';
import { requestRouter } from './modules/requests/request.routes';

export const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/rides', rideRouter);
app.use('/requests', requestRouter)
app.use(authRouter);
