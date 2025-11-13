import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {   // ✅ correct method
            token = token.split(" ")[1];              // take only the token part
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Ensure we're using the correct property from the decoded token
            const userId = decoded.id || decoded._id;

            req.user = await User.findById(userId).select("-password");

            next();
        } else {
            return res.status(401).json({ msg: "Not authorized, no token found" });
        }
    } catch (error) {
        res.status(401).json({
            message: "Token Failed",
            error: error.message,
        });
    }
};
