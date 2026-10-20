import { Schema, model } from "mongoose";

const SessionSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  sessionNumber: { type: Number, required: true },
  sessionDate: { type: Date, required: true },
  topic: { type: String, required: true },
  status: {
    type: String,
    enum: { values: ["scheduled", "done", "cancelled"] },
    message: "The Type Of Process must is scheduled, done, cancelled",
  },
}, {
    timestamps: true
});

export const Session = model("Session", SessionSchema);
