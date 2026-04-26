const express = require("express");

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validateData");




authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { password, firstName, lastName, emailId, location, interests, age } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword", hashedPassword);
        const data = {
            firstName, lastName, emailId, password: hashedPassword, age, interests, location
        }
        const user = new User(data);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error("Error while signing up:", error);
        res.status(404).send("Error : " + error.message);
    }

})

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials")
        }
        console.log("password", password);
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        console.log("isCorrectPassword", isCorrectPassword);
        if (!isCorrectPassword) {
            throw new Error("Invalid credentials")
        }
        const token = await user.getJWT();
        res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 30 });
        res.status(201).send("Login successfully");
    }
    catch (error) {
        console.log("Error :", error)
        res.status(404).send("Error : " + error.message);
    }
})

module.exports = authRouter;