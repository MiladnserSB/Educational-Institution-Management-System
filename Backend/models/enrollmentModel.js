import { model, Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      trim: true,
    },
    cohorttId: {
      type: Schema.Types.ObjectId,
      ref: "cohorts",
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "withdrawn", "completed"],
      },
    },
    enrolledAt: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export const Enrollment = model("Course", enrollmentSchema);
