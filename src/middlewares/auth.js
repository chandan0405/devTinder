const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("tokens", token)
    try {
        if (!token) {
            throw new Error("Token doesn't found, Please login again")
        }
        const decryptedData = await jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        console.log("decryptedData", decryptedData);
        const { _id: userId } = decryptedData;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        res.send("Error: " + error.message)
    }
}

module.exports = {
    authUser
}