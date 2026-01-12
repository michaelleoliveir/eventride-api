import { Request, Response } from "express";
import { EventService } from "./event.service";

const eventService = new EventService();

export class EventController {
    async create(req: Request, res: Response) {
        const event = await eventService.create({
            ...req.body,
            userId: req.userId
        });

        return res.status(201).json(event)
    }
}