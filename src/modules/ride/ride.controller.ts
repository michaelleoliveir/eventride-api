import { Request, Response } from "express";
import { RideService } from "./ride.service";

const rideService = new RideService();

export class RideController {
    async create(req: Request, res: Response) {
        const ride = await rideService.create({
            ...req.body,
            userId: req.userId
        });

        return res.status(201).json(ride)
    };

    async findByEvent(req: Request, res: Response) {
        const { id } = req.params;
        const ride = await rideService.findByEvent(id)

        return res.status(200).json(ride)
    };

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const ride = await rideService.delete(id, req.userId!);

        return res.status(201).json({ message: 'Ride deleted successfully' })
    }
}