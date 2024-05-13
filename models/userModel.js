const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/loginSignUp");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Users", userSchema);