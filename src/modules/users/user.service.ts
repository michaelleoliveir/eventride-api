// REGRA DE NEGÓCIO

import * as bcrypt from 'bcrypt'
import { prisma } from "../../lib/prisma"

import { CreateUserDTO, UserResponse } from './users.dto';

export class UserService {
    private readonly SALT_ROUNDS = 10;

    async create(data: CreateUserDTO): Promise<UserResponse> {

        // verifica se usuário já existe
        const exists = await prisma.user.findUnique({
            where: { email: data.email }
        });

        // se o usuário já existe, manda mensagem de erro
        if (exists) {
            throw new Error("User already exists")
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
                updatedAt: true
            }
        });

        return user
    }
}