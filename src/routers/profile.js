const { authUser } = require("../middlewares/auth")
const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  const user = req.user;
  res.status(201).send("user is: " + user);
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  const inputData = await req.body;
  console.log("inputData", inputData)
  const updateKeysList = ["firstName", "lastName", "age", "gender", "profileUrl", "location"];
  const user = req.user;

  const canUpdate = Object.keys(inputData).every((item) => updateKeysList.includes(item));
  if (!canUpdate) {
    throw new Error("cannot update the data");
  }
  const loggedInUserData = req.user;
  Object.keys(req.body).forEach((item) => loggedInUserData[item] = req.body[item]);
  console.log("loggedin user", loggedInUserData);
  res.send("profile updated was successfull" + loggedInUserData);
})


profileRouter.post('/forgot-password', authUser, async (req, res) => {
  const loggedInUser = req.user;
  console.log("current password", loggedInUser.password)
  const { currentPassword, newPassword } = await req.body;
  console.log("currentPassword, newPassword", currentPassword, newPassword)
  try {
    const isPasswordCorrect = await bcrypt.compare(currentPassword, loggedInUser.password);
    console.log("isPasswordCorrect", isPasswordCorrect)
    if (!isPasswordCorrect) {
      throw new Error("Invalid credential")
    }
    const decodednewPass = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = decodednewPass;
    await loggedInUser.save();
    res.send("password updates successfully" + loggedInUser.password)
  } catch (error) {
    res.status(404).send("Error: " + error.message)
  }
})


profileRouter.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', null, {
      httpOnly: true,
      path: '/'
    })
    res.send("Logout successfull");

  } catch (error) {

  }
})


module.exports = profileRouter;
