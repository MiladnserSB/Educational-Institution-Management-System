// import User from "../models/userModel.js";

// export const getUsers = async ({
//   page = 1,
//   limit = 10,
//   role,
//   isActive,
//   search,
// } = {}) => {
//   const filter = { deletedAt: null };

//   if (role) filter.role = role;
//   if (typeof isActive === "boolean") filter.isActive = isActive;
//   if (search) {
//     filter.$or = [
//       { fullName: { $regex: search, $options: "i" } },
//       { email: { $regex: search, $options: "i" } },
//     ];
//   }

//   const skip = (page - 1) * limit;

//   const [users, total] = await Promise.all([
//     User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
//     User.countDocuments(filter),
//   ]);

//   return {
//     data: toUserResponseList(users),
//     pagination: {
//       total,
//       page,
//       limit,
//       pages: Math.ceil(total / limit),
//     },
//   };
// };

// // ============ READ (One) ============
// export const getUserById = async (id) => {
//   const user = await User.findOne({ _id: id, deletedAt: null });
//   if (!user) throw new AppError("User not found", 404);
//   return toUserResponse(user);
// };

// // ============ UPDATE ============
// export const updateUser = async (id, payload) => {
//   const user = await User.findOne({ _id: id, deletedAt: null });
//   if (!user) throw new AppError("User not found", 404);

//   // منع تكرار الإيميل
//   if (payload.email && payload.email !== user.email) {
//     const exists = await User.findOne({ email: payload.email });
//     if (exists) throw new AppError("Email already exists", 409);
//   }

//   // الـ role النهائي بعد التحديث (لحساب حقول التحقق الشرطية)
//   const finalRole = payload.role ?? user.role;

//   // إذا تغيّر الـ role، نحذف الحقول غير المنطبقة
//   if (finalRole === "student") {
//     user.specialization = undefined;
//     user.bio = undefined;
//   } else if (finalRole === "teacher") {
//     user.study = undefined;
//   } else {
//     // admin / secretary
//     user.study = undefined;
//     user.specialization = undefined;
//     user.bio = undefined;
//   }

//   // الحقول المسموح تحديثها
//   const updatable = [
//     "fullName",
//     "email",
//     "phone",
//     "role",
//     "isActive",
//     "birthDate",
//   ];
//   for (const key of updatable) {
//     if (payload[key] !== undefined) user[key] = payload[key];
//   }

//   // حقول خاصة بالـ role
//   if (finalRole === "student" && payload.study !== undefined)
//     user.study = payload.study;
//   if (finalRole === "teacher") {
//     if (payload.specialization !== undefined)
//       user.specialization = payload.specialization;
//     if (payload.bio !== undefined) user.bio = payload.bio;
//   }

//   // كلمة المرور
//   if (payload.password) {
//     user.passwordHash = await bcrypt.hash(payload.password, 10);
//   }

//   await user.save(); // يشغّل الـ validators
//   return toUserResponse(user);
// };

// // ============ DELETE (Soft) ============
// export const softDeleteUser = async (id) => {
//   const user = await User.findOneAndUpdate(
//     { _id: id, deletedAt: null },
//     { deletedAt: new Date(), isActive: false },
//     { new: true },
//   );
//   if (!user) throw new AppError("User not found", 404);
//   return toUserResponse(user);
// };

// // ============ DELETE (Hard) ============
// export const hardDeleteUser = async (id) => {
//   const user = await User.findByIdAndDelete(id);
//   if (!user) throw new AppError("User not found", 404);
//   return { message: "User permanently deleted" };
// };

// // ============ RESTORE ============
// export const restoreUser = async (id) => {
//   const user = await User.findOneAndUpdate(
//     { _id: id, deletedAt: { $ne: null } },
//     { deletedAt: null, isActive: true },
//     { new: true },
//   );
//   if (!user) throw new AppError("Deleted user not found", 404);
//   return toUserResponse(user);
// };
