const dns = require("dns");

function applyPreferredDns () {
  const list = (process.env.DNS_SERVERS || "8.8.8.8,8.8.4.4,1.1.1.1")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  try {
    if (list.length) dns.setServers(list);
  } catch {
    // OS may not allow overriding resolvers (ignore).
  }
}

applyPreferredDns();
require("dotenv").config();
applyPreferredDns();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validateData");
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authAdmin } = require("./middlewares/auth");



app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
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



app.get('/profile', authAdmin, async (req, res) => {
  const user = req.user;
  res.status(201).send("user is: " + user)
})


connectDb()
  .then(() => {
    console.log("connected db successfully");
    app.listen(3000, () => {
      console.log("server is successfully listening on port 3000");
    });
  })
  .catch((error) => {
    console.error("Failed to start server (database unavailable):", error.message);
    process.exit(1);
  });


