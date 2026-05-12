const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();


userRouter.get("/User/getAllRequest", authUser, async (req, res) => {

  const loggedInUser = req.user;
  try {
    const request = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName age gender skills")
    if (!request.length) {
      throw new Error("No any request has been found.")
    }
    res.json({ message: " received connection request", data: request })

  } catch (error) {
    res.status(404).send("Error: " + error.message)
  }
})


module.exports = userRouter;
