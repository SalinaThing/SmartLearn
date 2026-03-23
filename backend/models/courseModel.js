import mongoose from "mongoose";

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: Object, // Or define a sub-schema for user info
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    required: true,
  },
  commentReplies:[Object], // Fixed from [object] to [Object]
});

// Link Schema
const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  user: {
    type: Object, // Or define a sub-schema for user info
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  questionReplies: {
    type: [Object], // Fixed from [object] to [Object]
    default: [],
  },
}, {timestamps: true});

// Course Data Schema
const courseDataSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: {
    type: [linkSchema],
    default: [],
  },
  suggestion: String,
  questions: {
    type: [commentSchema],
    default: [],
  },
});

// Main Course Schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required:true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: Number,
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: {
    type: [{ title: String }],
    default: [],
  },
  prerequisites: {
    type: [{ title: String }],
    default: [],
  },
  reviews: {
    type: [reviewSchema],
    default: [],
  },
  courseData: {
    type: [courseDataSchema],
    default: [],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // optional: adds createdAt and updatedAt
});

const CourseModel = mongoose.model("Course", courseSchema);
export default CourseModel;