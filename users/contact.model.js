const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});
userSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
async function findContactByIdAndUpdate(contactId, updateParameter) {
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
const contactModel = mongoose.model("Contact", userSchema);
module.exports = contactModel;
