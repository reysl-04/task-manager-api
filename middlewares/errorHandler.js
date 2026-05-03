export default function errorHandler(err, req, res, next) {
    return res.status(err.status || 500).json({
        error: err.message,
        ...(err.details && {details: err.details})
        })
}