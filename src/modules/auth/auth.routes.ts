import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
const controller = new AuthController();

router.post('/sessions', controller.login);

export { router as authRouter }