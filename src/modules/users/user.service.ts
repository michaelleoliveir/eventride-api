// REGRA DE NEGÓCIO

import * as bcrypt from 'bcrypt'
import { prisma } from "../../lib/prisma"

import { CreateUserDTO, UpdateUserDTO, UserResponse } from './users.dto';
import { AppError, NotFoundError } from '../../errors/AppError';

export class UserService {
    private readonly SALT_ROUNDS = 10;

    async create(data: CreateUserDTO): Promise<UserResponse> {

        // verifica se usuário já existe
        const exists = await prisma.user.findUnique({
            where: { email: data.email },
            select: { id: true }
        });

        // se o usuário já existe, manda mensagem de erro
        if (exists) {
            throw new AppError("User already exists")
        };

        const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)

        // se o usuário não existe, cria um novo
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                isActive: true
            }
        });

        return user
    };

    async findMe(userId: string): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new NotFoundError();
        };

        return user
    };

    async updateMe(data: UpdateUserDTO): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: {
                id: data.userId
            }
        });

        if (!user) {
            throw new NotFoundError();
        };

        if (data.email) {
            const emailExists = await prisma.user.findUnique({
                where: {
                    email: data.email
                },
                select: {
                    id: true
                }
            });

            if (emailExists && emailExists.id !== data.userId) {
                throw new AppError("Email already in use")
            }
        };

        return await prisma.user.update({
            where: {
                id: data.userId
            },
            data: {
                name: data.name,
                email: data.email
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    };

    async deleteMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true, 
                isActive: true,
                ridesAsDriver: true
            }
        });

        if (!user) {
            throw new NotFoundError();
        }

        if (!user.isActive) {
            throw new AppError('User already deleted')
        };

        const hasFutureRides = await prisma.ride.findFirst({
            where: {
                driverId: userId,
                date: {
                    gte: new Date()
                }
            },
            select: {
                id: true
            }
        });

        if(hasFutureRides) {
            throw new AppError('You cannot delete an user with upcoming rides')
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                deletedAt: new Date(),
                isActive: false
            }
        })

        return { message: 'Account deactivated successfully' }
    }
}