import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        const result = await authService.login(req.body);

        return res.json(result)
    }
}