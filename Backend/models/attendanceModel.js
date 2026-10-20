import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    SessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    status: {
      type: String,
      enum: { values: ["present", "absent", "late"] },
      message: "The Type Of Process must is present, absent, late",
    },
  },
  {
    timestamps: true,
  },
);

export const Attendance = model("Session", AttendanceSchema);
