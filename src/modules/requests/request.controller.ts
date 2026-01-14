import { Request, Response } from "express";
import { RequestService } from "./request.service";

const requestService = new RequestService();

export class RequestController {
    async create(req: Request, res: Response) {
        const request = await requestService.create({
            userId: req.userId,
            ...req.body
        });

        return res.status(201).json(request)
    };

    async update(req: Request, res: Response) {
        const {id} = req.params
        
        const request = await requestService.update({
            requestId: id,
            userId: req.userId,
            ...req.body
        });

        return res.status(200).json(request)
    }
}