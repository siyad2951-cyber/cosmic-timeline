module.exports = (err, req, res, next) => {
    console.error(`[ERROR] ${req.path}:`, err.message);

    const statusCode = err.statusCode || (err.response && err.response.status) || 500;
    const response = {
        error: err.message || 'Internal server error',
        code: err.code || 'INTERNAL_ERROR',
        path: req.path
    };

    if (err.staleData) {
        response.fallback = err.staleData;
        response.fallbackNotice = 'Using cached data due to temporary outage';
    }

    res.status(statusCode).json(response);
};
