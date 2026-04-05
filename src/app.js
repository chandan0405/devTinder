const express = require("express");

const app = express();


app.get("/", (req, res) => {
    res.send("Hello World from the server");
})
app.get('/about', (req, res) => {
    res.send("About page ");
})
app.post("/about", (req, res) => {
    res.send("About page updated successfully");
})
app.post("/contact", (req, res) => {
    res.send("Contact page updated successfully");
})
// patch request
app.patch('/about', (req, res) => {
    res.send("about page is patched")
})
app.listen(3000, () => {
    console.log("server is running on port 3000");
});