import { useVirtualId } from "../db/database.js";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    url: String
});
useVirtualId(userSchema);

const User = mongoose.model('Users', userSchema);

export const findById = async (id) => {
    return User.findById(id);
};

export const createUser = async (user) => {
    return User.create(user);
};

export const findByUsername = async (username) => {
    return User.findOne({username});
};