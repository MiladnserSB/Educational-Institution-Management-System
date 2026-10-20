import { model, Schema } from "mongoose";

const enrollmentResultSchema = new Schema(
  {
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      trim: true,
    },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    qrade: { type: String, required: true },
    notes: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export const EnrollmentResult = model(
  "EnrollmentResult",
  enrollmentResultSchema,
);
