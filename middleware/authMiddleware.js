const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ message: "Access denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // ✅ Corrected line: Check for a nested 'user' object, otherwise use the decoded object itself
        req.user = decoded.user || decoded;
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
