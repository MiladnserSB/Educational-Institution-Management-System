import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    isActive: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

export const Course = model("Course", courseSchema);
