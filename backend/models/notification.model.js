import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // User who triggered the notification
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User who receives the notification
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "follow",
        "like",
        "comment",
      ],
      required: true,
    },

    // Optional message
    message: {
      type: String,
      required: true,
    },

    // Related post (if applicable)
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    flick: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flick",
      default: null,
    },

    isRead:{
        type:Boolean,
        default:false
    }
    
  },
  {
    timestamps: true,
  }
);



const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;