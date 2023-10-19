import { config } from '../config.js';
import MongoDb from 'mongodb';


let db;
export const connectDB = async () => {
  return MongoDb.MongoClient.connect(config.db.host)
    .then(client => {
      db = client.db();
    });
}

export const getUsers = () => {
  return db.collection('users');
};

export const getTweets = () => {
  return db.collection('tweets');
};