const { authAdmin } = require("../middlewares/auth")
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", authAdmin, async (req, res) => {
  const user = req.user;
  res.status(201).send("user is: " + user);
});

module.exports = profileRouter;
