class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
        this.status = 404
    }
}

class ValidationError extends Error {
    constructor(details) {
        super("Invalid field(s)")
        this.name = 'ValidationError'
        this.status = 422
        this.details = details
    }
}

export { NotFoundError, ValidationError }