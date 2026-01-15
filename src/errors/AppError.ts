// Error é a classe pai
// public = significa que pode ser acessada fora da classe
// readonly = não pode ser alterada após definida

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    // função que é executada quando cria um novo objeto new AppError()
    constructor(message: string, statusCode: number = 400) {
        super(message); // precisa ser chamado quando extende alguma classe

        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor) // para capturar exatamente o erro
    }
};

export class NotFoundError extends AppError {
    // passa uma mensagem como padrão
    constructor(message: string = 'Resource not found') {
        super(message, 404)
    }
};

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401)
    }
};

export class ValidationError extends AppError {
    constructor(message: string = 'Validation error') {
        super(message, 400)
    }
}