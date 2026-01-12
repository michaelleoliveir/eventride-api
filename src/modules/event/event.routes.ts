import { Router } from "express";
import { EventController } from "./event.controller";
import { ensureAuthenticated } from "../../middlewares/unsureAuthenticated";

const router = Router();
const controller = new EventController();

router.post('/', ensureAuthenticated, controller.create);

export {router as eventRouter}