import { NotFoundError, UnauthorizedError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { CreateEventDTO, UpdateEventDTO } from "./event.dto";

export class EventService {
    async create(data: CreateEventDTO) {
        return await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                address: {
                    create: data.address,
                },
                createdBy: {
                    connect: { id: data.userId },
                },
            },
            include: {
                address: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    };

    async findAll() {
        return await prisma.event.findMany({
            orderBy: {
                date: "asc"
            },
            include: {
                address: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    };

    async findOne(eventId: string) {
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            },
            include: {
                address: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                rides: {
                    include: {
                        driver: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!event) {
            throw new NotFoundError();
        };

        return event
    };

    async deleteOne(eventId: string, userId: string) {
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        });

        if (!event) {
            throw new NotFoundError();
        };

        if (event.createdById !== userId) {
            throw new UnauthorizedError();
        };

        await prisma.event.delete({
            where: {
                id: eventId
            }
        })
    };

    async updateOne(data: UpdateEventDTO) {
        const event = await prisma.event.findUnique({
            where: {
                id: data.eventId
            }
        });

        if (!event) {
            throw new NotFoundError();
        };

        if (event.createdById !== data.userId) {
            throw new UnauthorizedError();
        };

        return await prisma.event.update({
            where: { id: data.eventId },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                address: data.address ? {
                    update: data.address,
                } : undefined,
            },
            include: {
                address: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}