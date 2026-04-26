const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


const authAdmin = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("tokens", token)
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
}

module.exports = {
    authAdmin
}