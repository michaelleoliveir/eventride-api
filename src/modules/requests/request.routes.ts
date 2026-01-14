import { Router } from "express";
import { RequestController } from "./request.controller";
import { ensureAuthenticated } from "../../middlewares/unsureAuthenticated";

const router = Router();
const controller = new RequestController();

router.post('/', ensureAuthenticated, controller.create);

router.patch('/:id', ensureAuthenticated, controller.update)

export {router as requestRouter}