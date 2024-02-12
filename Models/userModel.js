import { Schema, model } from "mongoose";
import pkg from "bcryptjs";
const { compare, genSalt, hash } = pkg;
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPass = async function (pass) {
  return await compare(pass, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});
export default model("User", userSchema);
