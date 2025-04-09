const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).json({message: "No token, authorisation denied"});
    }
    const token = authHeader.split(" ")[1];
    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        req.role = decoded.role;
        next();
    }
    catch(err)
    {
        return res.status(401).json({message: "Invalid token"});
    }
};

module.exports = auth;