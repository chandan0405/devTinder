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


app.get("/user", async (req, res) => {
  const emailId = req.query.emailId;
  console.log("emailId", emailId)
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("User not found", emailId);
    }
    else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.error("Error while getting user:", error);
    res.status(500).send("Internal server error: " + error.message);
  }
})

app.get("/getAllUsers", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.status(200).send(allUser);
  } catch (error) {
    console.log("error getting all user", error);
    res.status(500).send("can't find all user");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  console.log("user Id", userId);
  try {
    const user = await User.findByIdAndDelete({ _id: userId })
    if (!user) {
      res.status(404).send("Not found user")
    }
    else {
      res.status(200).send("User deletd")
    }
  }
  catch (error) {
    console.log("error");
    res.status(500).send("server issue")
  }
})

app.patch("/update", async (req, res) => {
  const userId = req.body.id;
  const newData = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, newData);
    res.status(200).send("data upated successfully", user)

  } catch (error) {
    console.log("error in updating");
    res.status(500).send("Serve issue")
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


