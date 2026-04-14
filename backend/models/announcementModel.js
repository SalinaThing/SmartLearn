import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledFor: {
      type: Date,
      default: Date.now,
    },
    validTill: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// No pre-save hook needed as logic is handled in controller

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
