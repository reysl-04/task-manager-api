import type { Request, Response, NextFunction } from 'express'

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.code === '23505') {
        return res.status(409).json({ message: 'Email already in use' })
    }

    return res.status(err.status || 500).json({
        error: err.message,
        ...(err.details && {details: err.details})
        })
}