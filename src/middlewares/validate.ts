import type {Request, Response, NextFunction} from 'express'
import { ValidationError } from "../errors/customErrors.js"
import { z } from "zod"

export default function validateBody(schema: z.ZodSchema) {
    return function(req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            const err = z.flattenError(result.error)
            return next(new ValidationError(err.fieldErrors)) // Custom error export
        }
        req.body = result.data
        return next()
    }
}