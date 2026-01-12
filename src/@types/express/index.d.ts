// esse código está estendendo a tipagem do Express 
// para adicionar uma propriedade customizada ao objeto Request

import { Request } from "express";

declare module "express-serve-static-core" { // diz para o TS que estamos modificando um módulo existente
    // estende a interface Request do Express e adiciona a propriedade userId como opcional
    interface Request {
        userId?: string;
    }
}
