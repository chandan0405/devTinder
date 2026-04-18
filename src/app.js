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
const connectDb = require("./config/database");
const User = require("./models/user");
app.use(express.json());


app.post("/signup", async (req, res) => {
  const data = req.body;
  try {
    const user = new User(data);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error("Error while signing up:", error);
    res.status(500).send("Internal server error: " + error.message);
  }

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


