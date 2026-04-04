import Announcement from "../models/announcementModel.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { io } from "../serverSocket.js";
import NotificationModel from "../models/notificationModel.js";

const normalizeDate = (value, fallback = null) => {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Create announcement (teacher only, enforced in route)
export const createAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const { title, content, courseId, scheduledFor, validTill } = req.body;

  if (!title || !content || !courseId) {
    return next(new ErrorHandler(400, "Title, content and courseId are required"));
  }

  const scheduledDate = normalizeDate(scheduledFor, new Date());
  const validTillDate = normalizeDate(validTill, null);

  if (!scheduledDate) {
    return next(new ErrorHandler(400, "Invalid scheduledFor date"));
  }

  if (validTillDate && validTillDate < scheduledDate) {
    return next(new ErrorHandler(400, "validTill must be after scheduledFor"));
  }

  const announcement = await Announcement.create({
    userId: req.user._id,
    courseId,
    title: title.trim(),
    content: content.trim(),
    scheduledFor: scheduledDate,
    validTill: validTillDate,
  });

  try {
    await NotificationModel.create({
      title: "New Announcement",
      message: `A new announcement has been posted: "${announcement.title}"`,
      role: 'all' // Shows for students and admins
    });
    // Emit socket event to both
    io.to("student").to("admin").emit("newNotification", {
      title: "New Announcement",
      message: `A new announcement has been posted: "${announcement.title}"`,
    });
  } catch (error) {
    console.log("Announcement notification error:", error);
  }

  return res.status(201).json({
    success: true,
    announcement,
  });
});

// Update announcement (teacher only, enforced in route)
export const updateAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, courseId, scheduledFor, validTill } = req.body;

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    return next(new ErrorHandler(404, "Announcement not found"));
  }

  // Only owner teacher can edit their own announcement
  if (announcement.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler(403, "You can only edit your own announcements"));
  }

  const nextScheduledFor = scheduledFor !== undefined
    ? normalizeDate(scheduledFor, null)
    : announcement.scheduledFor;
  const nextValidTill = validTill !== undefined
    ? normalizeDate(validTill, null)
    : announcement.validTill;

  if (!nextScheduledFor) {
    return next(new ErrorHandler(400, "Invalid scheduledFor date"));
  }

  if (nextValidTill && nextValidTill < nextScheduledFor) {
    return next(new ErrorHandler(400, "validTill must be after scheduledFor"));
  }

  announcement.title = title !== undefined ? title.trim() : announcement.title;
  announcement.content = content !== undefined ? content.trim() : announcement.content;
  announcement.courseId = courseId || announcement.courseId;
  announcement.scheduledFor = nextScheduledFor;
  announcement.validTill = nextValidTill;

  await announcement.save();

  try {
    await NotificationModel.create({
      title: "Announcement Updated",
      message: `Announcement "${announcement.title}" has been updated.`,
      role: 'student'
    });
    // Emit socket event
    io.to("student").emit("newNotification", {
      title: "Announcement Updated",
      message: `Announcement "${announcement.title}" has been updated.`,
    });
  } catch (error) {
    console.log("Announcement update notification error:", error);
  }

  return res.status(200).json({
    success: true,
    announcement,
  });
});

// Get announcements by course
export const getAnnouncementsByCourse = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;

  const announcements = await Announcement.find({ courseId })
    .populate("userId", "name role")
    .sort({ scheduledFor: -1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    announcements,
  });
});

// Delete announcement (teacher only, enforced in route)
export const deleteAnnouncement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    return next(new ErrorHandler(404, "Announcement not found"));
  }

  // Only owner teacher can delete their own announcement
  if (announcement.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler(403, "You can only delete your own announcements"));
  }

  await Announcement.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Announcement deleted successfully",
  });
});
