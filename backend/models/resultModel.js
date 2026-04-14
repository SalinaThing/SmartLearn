import mongoose from 'mongoose';

const performanceEnum = ['Excellent', 'Good', 'Average', 'Needs Work'];

const ResultSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 0
    },
    correct: {
        type: Number,
        required: true,
        min: 0,
        default: 0 
    },
    wrong: {
        type: Number,
        required: true,
        min: 0,
        default: 0 
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    performance: {
        type: String,
        enum: performanceEnum, 
        default: 'Needs Work'
    }
},
  { timestamps: true 
  });
// Automatically delete documents after 6 months (15,552,000 seconds)
ResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

// COMPUTE SCORE AND PERFORMANCE BEFORE SAVING
ResultSchema.pre('save', function (next) {
   const total = Number(this.totalQuestions) || 0;
   const correct = Number(this.correct) || 0;

    this.score = total ? Math.round((correct / total) * 100) : 0;
    if (this.score >= 85) {
        this.performance = 'Excellent';
    } else if (this.score >= 70) {
        this.performance = 'Good';
    } else if (this.score >= 50) {
        this.performance = 'Average';
    } else {
        this.performance = 'Needs Work';
    } 

    if ((this.wrong === undefined || this.wrong === null) && total) {
        this.wrong = Math.max(0, total - correct);
    }
    next();
});

const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export default Result;