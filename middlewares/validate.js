import { ValidationError } from "../errors/customErrors.js"

export default function validateBody(schema) {
    return function(req, res, next) {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            return next(new ValidationError(result.error.message)) // Custom error export
        }
        return next()
    }
}