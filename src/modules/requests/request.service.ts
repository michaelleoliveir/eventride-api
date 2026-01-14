import { prisma } from "../../lib/prisma";
import { CreateRequestDTO, UpdateRequestDTO } from "./request.dto";

export class RequestService {
    async create(data: CreateRequestDTO) {
        const ride = await prisma.ride.findUnique({
            where: {
                id: data.rideId
            }
        });

        if (!ride) {
            throw new Error('Ride not found')
        };

        if (ride.driverId === data.userId) {
            throw new Error('Driver cannot request their own ride')
        };

        if (ride.availableSeats <= 0) {
            throw new Error('No available seats')
        };

        const existingRequest = await prisma.request.findUnique({
            where: {
                rideId_requesterId: {
                    requesterId: data.userId,
                    rideId: data.rideId
                }
            }
        });

        if (existingRequest) {
            throw new Error('Request already exists')
        }

        const request = await prisma.request.create({
            data: {
                rideId: data.rideId,
                requesterId: data.userId,
                status: 'PENDING'
            },
            include: {
                ride: {
                    select: {
                        availableSeats: true,
                        date: true
                    },
                    include: {
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
                                date: true
                            }
                        },
                        origin: true,
                        destination: true
                    }
                },
            }
        });

        return request
    };

    async update(data: UpdateRequestDTO) {
        const request = await prisma.request.findUnique({
            where: {
                id: data.requestId
            },
            include: {
                ride: true
            }
        });

        if(!request) {
            throw new Error('Request not found')
        };

        if(request.status !== 'PENDING') {
            throw new Error('Request already processed')
        };

        if(request.ride.driverId !== data.userId) {
            throw new Error('Not authorized')
        };

        if(data.status === 'ACCEPTED') {
            if(request.ride.availableSeats <= 0) {
                throw new Error('No available seats')
            }

            // tirando 1 valor de availableSeats
            await prisma.ride.update({
                where: {
                    id: request.rideId
                },
                data: {
                    availableSeats: {
                        decrement: 1
                    }
                }
            })
        };

        const updatedRequest = await prisma.request.update({
            where: {
                id: data.requestId
            },
            data: {
                status: data.status
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ride: {
                    include: {
                        event: true,
                        driver: true
                    }
                }
            }
        });

        return updatedRequest;
    }
}