import { z } from "zod";

const baseUser = {
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  role: z.enum(["admin", "secretary", "teacher", "student"]),
  isActive: z.boolean().optional(),
  birthDate: z.coerce.date(),
};

export const createUserSchema = z
  .object({
    ...baseUser,
    password: z.string().min(6).max(64),
    study: z.string().optional(),
    specialization: z.string().optional(),
    bio: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "student" && !data.study) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["study"],
        message: "study is required for students",
      });
    }
    if (data.role === "teacher") {
      if (!data.specialization)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialization"],
          message: "specialization is required for teachers",
        });
      if (!data.bio)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bio"],
          message: "bio is required for teachers",
        });
    }
  });

export const updateUserSchema = z
  .object({
    fullName: baseUser.fullName.optional(),
    email: baseUser.email.optional(),
    phone: baseUser.phone.optional(),
    role: baseUser.role.optional(),
    isActive: z.boolean().optional(),
    birthDate: z.coerce.date().optional(),
    password: z.string().min(6).max(64).optional(),
    study: z.string().optional(),
    specialization: z.string().optional(),
    bio: z.string().optional(),
  })
  .strict();

export const loginUserSchema = z.object({
  email: baseUser.email,
  password: z.string().min(6).max(64),
});