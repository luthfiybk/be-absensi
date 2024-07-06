const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized - Missing Token" });
    }

    try {
        const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

        if (!decodedToken || !decodedToken.nip) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }
        
        
        req.decodedToken = decodedToken;
        
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized - Token expired" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        
    }
};

module.exports = auth;
