import { Router } from "express";
import { EventController } from "./event.controller";
import { ensureAuthenticated } from "../../middlewares/unsureAuthenticated";

const router = Router();
const controller = new EventController();

router.post('/', ensureAuthenticated, controller.create);

router.get('/', ensureAuthenticated, controller.findAll);
router.get('/:id', ensureAuthenticated, controller.findOne);

router.delete('/:id', ensureAuthenticated, controller.deleteOne);

router.patch('/:id', ensureAuthenticated, controller.updateOne);

export {router as eventRouter}