const paginationMiddleware = (req, res, next) => {
    let pageSize = parseFloat(req.query.pageSize);
    let page = parseFloat(req.query.page);
    console.log(pageSize);
    console.log(page);
};

module.exports = paginationMiddleware;