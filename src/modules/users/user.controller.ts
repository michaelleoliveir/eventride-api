import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
    async create(req: Request, res: Response) {
        const service = new UserService();

        const user = await service.create(req.body);

        return res.status(201).json(user)
    }
}