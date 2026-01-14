import { Router } from "express";
import { UserController } from "./user.controller";
import { ensureAuthenticated } from "../../middlewares/unsureAuthenticated";

const router = Router();
const controller = new UserController();

router.post('/', controller.create);

router.get('/me', ensureAuthenticated, controller.findMe);

router.patch('/me', ensureAuthenticated, controller.updateMe);

router.delete('/me', ensureAuthenticated, controller.deleteMe)

export {router as userRouter}