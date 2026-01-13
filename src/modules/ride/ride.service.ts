import { prisma } from "../../lib/prisma";
import { CreateRideDTO } from "./ride.dto";

export class RideService {
    async create(data: CreateRideDTO) {
        const event = await prisma.event.findUnique({
            where: {
                id: data.eventId
            }
        });

        if (!event) {
            throw new Error('Event not found')
        };

        if (data.totalSeats < 1) {
            throw new Error('Total seats must be at least 1');
        }

        const originAddress = await prisma.address.create({
            data: data.originAddress
        });

        const destinationAddress = await prisma.address.create({
            data: data.destinationAddress
        });

        return await prisma.ride.create({
            data: {
                date: data.date,
                totalSeats: data.totalSeats,
                availableSeats: data.totalSeats,

                originAddressId: originAddress.id,
                destinationAddressId: destinationAddress.id,

                eventId: data.eventId,
                driverId: data.userId
            },
            include: {
                origin: true,
                destination: true,
                driver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                }
            }
        })
    }

    async findByEvent(eventId: string) {
        return await prisma.ride.findMany({
            where: {
                eventId
            },
            include: {
                origin: true,
                destination: true,
                driver: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })
    };

    async delete(rideId: string, userId: string) {
        const ride = await prisma.ride.findUnique({
            where: {
                id: rideId
            }
        });

        if(!ride) {
            throw new Error('Ride not found')
        };

        if(ride.driverId !== userId) {
            throw new Error('Not authorized')
        };

        await prisma.ride.delete({
            where: {
                id: rideId
            }
        })
    }
}