import { Router } from "express";
import { RequestController } from "./request.controller";
import { ensureAuthenticated } from "../../middlewares/unsureAuthenticated";

const router = Router();
const controller = new RequestController();

router.get('/received', ensureAuthenticated, controller.received);
router.get('/sent', ensureAuthenticated, controller.sent)

router.post('/', ensureAuthenticated, controller.create);

router.delete('/:id', ensureAuthenticated, controller.cancel)

router.patch('/:id', ensureAuthenticated, controller.update);

export {router as requestRouter}