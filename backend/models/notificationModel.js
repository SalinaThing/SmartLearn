import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    message:{
            type: String,
            required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        required: true,
        default: "unread",
    },
    role:{
        type: String,
        default: "all",
    },
    path:{
        type: String,
    }
}, { timestamps: true });

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;