import { User } from "../models/usersModel.js";

export const getAllUsers = () => User.find();
export const getUserById = (uid) => User.findById(uid);
export const createNewUser = (userData) => User.create(userData);
export const updateUser = (uid, userData) =>
  User.findByIdAndUpdate(uid, userData);
export const deleteUser = (uid) => User.findByIdAndDelete(uid);
