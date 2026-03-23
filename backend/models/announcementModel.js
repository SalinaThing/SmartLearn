import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
