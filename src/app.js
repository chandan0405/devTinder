const express = require("express");

const app = express();

// url params
// app.get('/user', (req, res) => {
//     const id = req.query;
//     console.log(id);
//     res.send(`User id is logged`);
// })

// app.post('/post', (req, res) => {
//     const queryparams = req.query;
//     console.log(queryparams);
//     res.send("Post request is logged");
// })

// app.get('/user/:userId/:name/:age', (req, res) => {
//     const { userId, name, age } = req.params;
//     console.log(userId, name, age);
//     res.send(`User id is ${userId}, name is ${name}, age is ${age}`);
// })


app.use("/user", (req, res, next) => {
    console.log("first response from the user route");
    next();
    res.send("User route is logged");

},
    (req, res) => {
        console.log("second response from the user route");
        res.send("User route is logged second time");
    }
)


app.listen(3000, () => {
    console.log("server is running on port 3000");
});