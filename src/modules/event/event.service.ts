import { prisma } from "../../lib/prisma";
import { CreateEventDTO } from "./event.dto";

export class EventService {
    async create(data: CreateEventDTO) {

        // criando o endereço primeiro
        const address = await prisma.address.create({
            data: data.address
        })

        const event = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                addressId: address.id,
                createdById: data.userId
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

        return event
    };

    async findAll() {
        const events = await prisma.event.findMany({
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

        return events;
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

        if(!event) {
            throw new Error('Event not found')
        };

        return event
    };

    async deleteOne(eventId: string, userId: string) {
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        });

        if(!event) {
            throw new Error('Event not found')
        };

        if(event.createdById !== userId) {
            throw new Error('Not authorized')
        };

        await prisma.event.delete({
            where: {
                id: eventId
            }
        })
    }
}