const express = require("express");
const { adminAuth } = require("./middlewares/auth")
const app = express();

// middleware for the admin authentication

app.use("/admin", adminAuth)

app.use('/admin/addUser', (req, res) => {
    res.send("user created successfully by admin")
})


app.listen(3000, () => {
    console.log("server is running on port 3000");
});