import mongoose from 'mongoose';
import { config } from '../config.js';

export const connectDB = async () => {
  return mongoose.connect(config.db.host)
}

export const useVirtualId = (userSchema) => {
  userSchema.virtual('id').get(function() {
      return this._id.toString();
  });
  userSchema.set('toJSON', {virtuals: true});
  userSchema.set('toObject', {virtuals: true});
}