import { db } from "../db/database.js";

export const findById = async (id) => {
    return db.execute(`select id, username, password, name, email, url from users u where u.id = ?`, [id])
    .then(result => result[0][0]);
};

export const createUser = async (user) => {
    const {username, password, name, email, url} = user;
    return db
    .execute(`insert into users (username, password, name, email, url) values (?,?,?,?,?)`, [
        username, password, name, email, url
    ])
    .then(result => result[0].insertId);
};

export const findByUsername = async (username) => {
    return db
    .execute(`select id, username, password, name, email, url from users u where u.username = ?`, [username])
    .then(result => result[0][0]);
};