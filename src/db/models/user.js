import mongoose from 'mongoose';
import { USER_ROLES } from '../../config/constants';

const Schema = mongoose.Schema;

/*
  username:     a unique username for this user
  realName:     full name of the user
  phone:        phone number of user
  email:        email address of user
  organization: organization of user
  other:        other useful information in text
  createdTime:  server timestamp of creation of user (set by api)
 */

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [ true, 'username required' ],
    minlength: [ 5, 'username must be at least 5 chars']
  },
  password: {
    type: String,
    required: [ true, 'password required' ],
    minlength: [ 8, 'password must be at least 8 chars']
  },
  role: {
    type: String,
    required: [ true, 'role required' ],
    enum: USER_ROLES,
  },
  realName: {
    type: String,
    required: [ true, 'realName required' ],
    minlength: [ 5, 'realName must be at least 5 chars']
  },
  phone: {
    type: String,
    required: [ true, 'phone required' ]
  },
  email: {
    type: String,
    required: [ true, 'email required' ],
    minlength: [ 4, 'email must be at least 4 chars']
  },
  organization: {
    type: String
  },
  other: {
    type: String
  },
  createdTime: {
    type: Date,
    default: Date.now
  }
});

UserSchema.index({ username: 1 });

module.exports = mongoose.model('User', UserSchema);
