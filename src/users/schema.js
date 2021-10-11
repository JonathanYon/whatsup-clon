import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const { Schema, module } = mongoose;

const UsersSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default: "https://bit.ly/3lBk8d3",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default module("User", UsersSchema);
//password hashing

UsersSchema.pre("save", async function (next) {
  const thisUser = this;
  const plainPassword = thisUser.password;
  if (thisUser.isModified("password")) {
    thisUser.password = await bcrypt.hash(plainPassword, 11);
  }
  next();
});
// update logged user info
UsersSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  console.log("getUpdate()-->", update);
  const { password: plainPassword } = update;
  if (plainPassword) {
    const password = await bcrypt.hash(plainPassword, 11);
    this.setUpdate({ ...update, password });
  }
});
// removing password from the get route
UsersSchema.methods.toJSON() = function(){
    const userInfo = this
    const userObj = userInfo.toObject()
    delete userObj.password
    return userObj
}
