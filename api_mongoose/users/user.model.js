const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.updateToken = updateToken;
async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function findUserByIdAndUpdate(contactId, updateParameter) {
  return this.findByIdAndUpdate(
    contactId,
    {
      $set: updateParameter,
    },
    {
      new: true,
    }
  );
}
async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
