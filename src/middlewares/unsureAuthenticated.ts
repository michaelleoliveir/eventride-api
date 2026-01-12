import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"

interface TokenPayload {
    sub: string
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
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

        // injeta o token no request
        req.userId = decoded.sub;

        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" })
    }
}