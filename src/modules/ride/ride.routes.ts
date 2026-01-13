import { Router } from "express";
import { RideController } from "./ride.controller";
import { ensureAuthenticated } from "../../middlewares/unsureAuthenticated";

const router = Router();
const controller = new RideController();

router.post('/', ensureAuthenticated, controller.create);

router.get('/:id', ensureAuthenticated, controller.findByEvent);

router.delete('/:id', ensureAuthenticated, controller.delete)

export { router as rideRouter }