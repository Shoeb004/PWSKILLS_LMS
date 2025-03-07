import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name should contain at most 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at leat 8 char"],
      select: false,
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    avatar: {
      public_id: {
        type: "String",
      },
      secure_url: {
        type: "String",
      },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next()
});

userSchema.methods = {
    generateJWTToken : async function () {

        await jwt.sign(
            {id: this._id, email: this.email, role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
        
    }
}

const User = model("User", userSchema);

export default User;
