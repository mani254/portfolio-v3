export enum HttpCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
    public readonly statusCode: HttpCode;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: HttpCode = HttpCode.INTERNAL_SERVER_ERROR, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, HttpCode.BAD_REQUEST);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, HttpCode.UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, HttpCode.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, HttpCode.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, HttpCode.CONFLICT);
    }
}
