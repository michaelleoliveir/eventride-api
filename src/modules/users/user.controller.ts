import { Request, Response } from "express";
import { UserService } from "./user.service";

const userService = new UserService();
export class UserController {
    async create(req: Request, res: Response) {
        const user = await userService.create(req.body);

        return res.status(201).json(user)
    }
}