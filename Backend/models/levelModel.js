import { model, Schema } from "mongoose";

const levelShcema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    orderNumber: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const Level = model("Level", levelShcema);
