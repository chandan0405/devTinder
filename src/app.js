const express = require("express");
const app = express();
const connectDb = require("./config/database");

connectDb()
    .then((data) => {
        console.log("connected db successfully");
        app.listen(3000, () => {
            console.log("server is successfully listening on port 3000");
        });
    })
    .catch((error) => console.log("Somethig got wrong"))


