import MongoDB from "mongodb";
import { getUsers } from "../db/database.js";

const ObjectId = MongoDB.ObjectId;

const mapOptionalUser = (user) => {
    return user ? {...user, id:user._id.toString()} : user;
}

export const findById = async (id) => {
    return getUsers().findOne({_id: new ObjectId(id)})
        .then(mapOptionalUser);
};

export const createUser = async (user) => {
    return getUsers().insertOne(user)
        .then(data => data.insertedId.toString())
};

export const findByUsername = async (username) => {
    return getUsers().findOne({username}).then(mapOptionalUser);
};