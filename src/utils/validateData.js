const validator = require("validator");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("FirstName or LastName can't be empty")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("password must be strong")
    }
}


module.exports = { validateSignUpData }