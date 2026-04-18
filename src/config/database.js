const mongoose = require('mongoose');

const dbURL = process.env.MONGODB_URL;

async function connectDb () {
  if (!dbURL) {
    throw new Error("MONGODB_URL is not set");
  }
  try {
    await mongoose.connect(dbURL);
  } catch (error) {
    console.log("Error while connecting the db", error);
    throw error;
  }
}

module.exports = connectDb;