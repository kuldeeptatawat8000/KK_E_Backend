const jwt = require("jsonwebtoken");
const authModel = require("../models/usersModel");

module.exports.requireSignIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};


module.exports.isAdmin = async (req, res, next) => {
    try {
        const user = await authModel.findById(req.user.id);

        if (!user || user.role !== 1) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
