"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mpContentType = 'application/marge-patch+json';
exports.mergePatchBodyParser = (req, res, next) => {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        req.rawBody = req.body;
        try {
            req.body = JSON.parse(req.body);
        }
        catch (error) {
            return next(new Error(`Invalid constent: ${error.message}`));
        }
    }
    return next();
};
