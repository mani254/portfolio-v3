import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as { body: any; query: any; params: any };

            // Replace original data with validated data (strips unknown fields)
            // We use defineProperty because req.query/params are often read-only getters in Express
            Object.defineProperty(req, 'body', { value: validatedData.body, writable: true, enumerable: true, configurable: true });
            Object.defineProperty(req, 'query', { value: validatedData.query, writable: true, enumerable: true, configurable: true });
            Object.defineProperty(req, 'params', { value: validatedData.params, writable: true, enumerable: true, configurable: true });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
};
