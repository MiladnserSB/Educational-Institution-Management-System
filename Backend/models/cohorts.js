import { model, Schema } from "mongoose";

const cohortSchema = new Schema(
  {
    _id: { type: String, Number: true, trim: true },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Cohort = model("Cohort", cohortSchema);
