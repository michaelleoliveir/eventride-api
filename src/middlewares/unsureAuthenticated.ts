import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma";

interface TokenPayload {
    sub: string
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // verifica se o token existe
    // se não existir, o usuário não acessa rotas protegidas
    if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" })
    }

    // pegamos o token que estava no header
    const token = authHeader.split(" ")[1]

    try {
        // valida o token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.sub
            },
            select: {
                isActive: true
            }
        });

        if(!user || !user.isActive) {
            return res.status(401).json({message: 'User not active'})
        };

        // injeta o token no request
        req.userId = decoded.sub;

        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" })
    }
}