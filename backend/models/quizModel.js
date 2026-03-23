import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
});

const quizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    questions: [questionSchema],
}, { timestamps: true });

const QuizModel = mongoose.model("Quiz", quizSchema);
export default QuizModel;
