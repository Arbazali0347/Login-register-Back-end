const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/Hack_Details");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  description: String
});



userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

