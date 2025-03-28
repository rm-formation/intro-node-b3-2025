export const authMiddleware = (req, res, next) => {
    if (req.headers.auth === 'true') {
        next();
    } else {
        res.end("nop");
    }
};

export const logMiddleware = (req, res, next) => {
    console.log("[REQUETE]", (new Date()).toISOString());
    next();
};
