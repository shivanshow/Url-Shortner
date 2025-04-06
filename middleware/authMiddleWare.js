const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

exports.protect = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access Denied! No Token Provided." });
    }

    try {
        req.user = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token!" });
    }
};