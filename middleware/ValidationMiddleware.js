const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.formatter.unprocess(errors.mapped());
    next();
};

module.exports = validationMiddleware;