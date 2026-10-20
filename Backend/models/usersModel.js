import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    _id: { type: Number, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "secretary", "teacher", "student"],
      },
    },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    // student fields
    study: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    birthDate: {
      type: Date,
      required: function () {
        return this.role === "student";
      },
    },
    // teatcher fields
    specialization: {
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
    bio: {
      // الملخص
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
  },

  { timestamps: true },
);

export const User = model("User", userSchema);
