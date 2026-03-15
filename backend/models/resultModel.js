// import mongoose from 'mongoose';

// const performanceEnum = ['Excellent', 'Good', 'Average', 'Needs Work']; // Define performance levels

// const ResultSchema = new mongoose.Schema({
//     user:{
//         type: mongoose.Schema.Types.ObjectId, // Reference to User model
//         ref: 'User', // Reference to User model
//         required: false // Not required to allow results without user association
//     },
//     title:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     technology: {
//         type: String,
//         required: true,
//         trim: true,
//         enum: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go'] // Define allowed technologies
//     },
//     level: {
//         type: String,
//         required: true,
//         enum: ['Beginner', 'Intermediate', 'Advanced'] // Define levels of difficulty
//     },
//     totalQuestions: {
//         type: Number,
//         required: true,
//         min: 0 // Total questions cannot be negative
//     },
//     correct: {
//         type: Number,
//         required: true,
//         min: 0,
//         default: 0 
//     },
//     wrong: {
//         type: Number,
//         required: true,
//         min: 0,
//         default: 0 
//     },
//     score: {
//         type: Number,
//         min: 0,
//         max: 100,
//         default: 0
//     },
//     performance: {
//         type: String,
//         enum: performanceEnum, 
//         default: 'Needs Work'
//     }
// },
//   { timestamps: true 

//   });

// //COMPUTE SCORE AND PERFORMANCE BEFORE SAVING
// ResultSchema.pre('save', function (next) {
//    // Compute score and performance based on totalQuestions, correct, and wrong
//    const total =Number(this.totalQuestions) || 0;
//    const correct =Number(this.correct) || 0;

//     this.score = total ? Math.round((correct / total) * 100) : 0;
//     if (this.score >= 85) {
//         this.performance = 'Excellent';
//     } else if (this.score >= 70) {
//         this.performance = 'Good';
//     } else if (this.score >= 50) {
//         this.performance = 'Average';
//     } else {
//         this.performance = 'Needs Work';
//     } 

//     if ((this.wrong === undefined || this.wrong === null) && total) {
//         this.wrong = Math.max(0, total - correct);
//     }
//     next();
// });

// const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);
// export default Result;