export default function errorHandler(err, req, res, next) {
    if (err.code === '23505') {
        return res.status(409).json({ message: 'Email already in use' })
    }

    return res.status(err.status || 500).json({
        error: err.message,
        ...(err.details && {details: err.details})
        })
}