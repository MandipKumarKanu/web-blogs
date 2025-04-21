const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    refreshToken: { type: String },
    role: { type: String, enum: ["user", "author", "admin"], default: "user" },
    interests: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  let saltRound = 10;

  try {
    const salt = await bcryptjs.genSalt(saltRound);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
