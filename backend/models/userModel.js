import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: {
        validator: function (v) {
          return emailRegexPattern.test(v);
        },
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [
      {
        courseId: String,
        completedLessons: {
          type: [String],
          default: [],
        },
      },
    ],
    searchHistory: {
      type: [String],
      default: [],
    },
    viewedCourses: {
      type: [String],
      default: [],
    },
    certificates: [
      {
        courseId: String,
        quizId: String,
        title: String,
        url: String,
        score: String,
        date: {
          type: Date,
          default: Date.now
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//Sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN || '', {
    expiresIn: "15m",
  }
  );
}

//Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN || '', {
    expiresIn: "3d",
  }
  );
}

//Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
