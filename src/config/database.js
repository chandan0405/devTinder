const mongoose = require('mongoose');

const dbURL = process.env.MONGODB_URL;

async function connectDb () {
  try {
    if (!dbURL) {
      console.log("envalid db URL")
      return;
    }
    await mongoose.connect(dbURL);
  } catch (error) {
    console.log("Error while connecting the db", error)
  }
}

module.exports = connectDb;