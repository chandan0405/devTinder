const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const userSchema = new Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
  lastName: { type: String, minlength: 3, maxlength: 50 },
  emailId: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: value => `${value} is not acceptable`
    },
    unique: true
  },
  password: {
    type: String, required: true, minlength: 8, maxlength: 50,
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value);
      },
      message: value => `${value} is not acceptable`
    }
  },
  age: { type: Number, required: true, min: 18, max: 50 },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"], default: "Other" },
  profileUrl: { type: String, required: true, default: "https://via.placeholder.com/150" },
  bio: { type: String, required: true, default: "No bio yet" },
  location: { type: String, required: true },
  interests: {
    type: [String], required: true,
    validate: {
      validator: function (value) {
        if (value.length < 3) {
          throw new Error("At least 3 interests are required");
        }
        if (value.length > 12) {
          throw new Error("At most 12 interests are allowed");
        }
        return true;
      },
      message: value => `${value} is not acceptable`
    }
  },
  matches: { type: [String], },
  messages: { type: [String], default: ["Welcome to the app"] },
  notifications: { type: [String], },
  settings: { type: [String], default: ["Notifications"] },
  preferences: { type: [String], default: ["Male"] },
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;