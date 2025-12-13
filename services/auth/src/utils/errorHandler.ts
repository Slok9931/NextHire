export default class ErrorHandler extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message); // Call the parent constructor with the message
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor); // Capture stack trace for better debugging
    }
}