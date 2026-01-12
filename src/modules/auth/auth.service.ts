import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

import { prisma } from "../../lib/prisma"
import { LoginDTO, LoginResponse } from "./auth.dto";

export class AuthService {
    async login(data: LoginDTO): Promise<LoginResponse> {

        // verifica se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        // se o usuário não existir, manda mensagem de erro
        if (!user) {
            throw new Error("Invalid credentials")
        };

        // comparando a senha inserida com a guardada na DB
        const passwordMatch = await bcrypt.compare(
            data.password, user.password
        );

        if (!passwordMatch) {
            throw new Error("Invalid credentials")
        };

        // criando o token de sessão
        const token = jwt.sign(
            { sub: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
}