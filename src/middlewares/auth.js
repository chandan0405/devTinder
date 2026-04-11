const adminAuth = (req, res, next) => {
    const token = "xyz";
    const recievedToken = "xyz";
    if (token === recievedToken) {
        next();
    }
    else {
        res.status(401).send("UnAuthorized player");
    }
}


module.exports = {
    adminAuth
}