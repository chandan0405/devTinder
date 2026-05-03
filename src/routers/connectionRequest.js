const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRequest = express.Router();


connectionRequest.post("/sendconnection/:status/:userId", authUser, async (req, res) => {

  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const status = req.params.status;
    const toUserId = req.params.userId;

    const requestedUser = await User.findById(toUserId);
    if (!requestedUser) {
      throw new Error("User doesn't exit")
    }

    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      throw new Error("Not valid allowed status");
    }

    console.log("fromuser", fromUserId.toString());
    console.log("touserid", toUserId);
    if (fromUserId.equals(toUserId)) {
      throw new Error("A user can't send requet to himself");
    }

    const isConnectionExist = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId, toUserId: fromUserId
        }
      ]
    });
    if (isConnectionExist) {
      throw new Error(" Already connection requested exist");
    }
    const data = {
      fromUserId,
      toUserId,
      status

    }
    const request = new ConnectionRequestModel(data);
    await request.save();
    let message;
    if (status === 'interested') {
      message = (`${loggedInUser.firstName} is ineterested in ${toUserId}`)
    }
    else {
      message = (`${loggedInUser.firstName} has passed the userid ${toUserId}`)
    }
    res.send(message);
  } catch (error) {
    res.send("Error: " + error.message)
  }

})


module.exports = connectionRequest