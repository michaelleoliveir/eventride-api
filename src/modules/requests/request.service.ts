import { AppError, NotFoundError, UnauthorizedError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { CreateRequestDTO, DeleteRequestDTO, UpdateRequestDTO } from "./request.dto";

export class RequestService {
    async create(data: CreateRequestDTO) {
        const ride = await prisma.ride.findUnique({
            where: {
                id: data.rideId
            }
        });

        if (!ride) {
            throw new NotFoundError();
        };

        if (ride.driverId === data.userId) {
            throw new UnauthorizedError('Driver cannot request their own ride');
        };

        if (ride.availableSeats <= 0) {
            throw new AppError('No available seats');
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
            throw new AppError('Request already exists')
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

        if (!request) {
            throw new NotFoundError();
        };

        if (request.status !== 'PENDING') {
            throw new AppError('Request already processed');
        };

        if (request.ride.driverId !== data.userId) {
            throw new UnauthorizedError();
        };

        if (data.status === 'ACCEPTED') {
            if (request.ride.availableSeats <= 0) {
                throw new AppError('No available seats')
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
    };

    async requestsReceived(driverId: string) {
        return await prisma.request.findMany({
            where: {
                ride: {
                    driverId
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                ride: {
                    include: {
                        driver: {
                            select: { id: true, name: true, email: true }
                        },
                        event: {
                            select: { id: true, title: true, date: true }
                        },
                        origin: true,
                        destination: true
                    }
                }
            }
        })
    };

    async requestsSent(requesterId: string) {
        return await prisma.request.findMany({
            where: {
                requesterId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                ride: {
                    include: {
                        driver: {
                            select: { id: true, name: true, email: true }
                        },
                        event: {
                            select: { id: true, title: true, date: true }
                        },
                        origin: true,
                        destination: true
                    }
                }
            }
        })
    };

    async cancel(data: DeleteRequestDTO) {
        const request = await prisma.request.findUnique({
            where: {
                id: data.requestId
            },
            include: {
                ride: true
            }
        });

        if (!request) {
            throw new NotFoundError();
        }

        if (request.requesterId !== data.userId) {
            throw new UnauthorizedError();
        }

        if (request.status === 'REJECTED') {
            throw new AppError('You cannot cancel a rejected request');
        }

        if (request.status === 'ACCEPTED') {
            await prisma.$transaction([
                prisma.ride.update({
                    where: {
                        id: request.rideId
                    },
                    data: {
                        availableSeats: {
                            increment: 1
                        }
                    }
                }),
                prisma.request.delete({
                    where: {
                        id: data.requestId
                    }
                })
            ]);

            return { message: 'Request canceled successfully' };
        }

        await prisma.request.delete({
            where: {
                id: data.requestId
            }
        });

        return { message: 'Request canceled successfully' };
    }

}