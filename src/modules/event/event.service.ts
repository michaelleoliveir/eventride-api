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
    }
}