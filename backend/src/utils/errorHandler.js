
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    const errors = err.errors || []; 
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
};
