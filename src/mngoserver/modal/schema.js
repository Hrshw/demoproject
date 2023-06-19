const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

// Schema for User
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Schema for Community
const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Schema for Role
const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Schema for Member
const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: Snowflake.generate,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
const Community = mongoose.model('Community', communitySchema);
const Role = mongoose.model('Role', roleSchema);
const Member = mongoose.model('Member', memberSchema);

module.exports = {
  User,
  Community,
  Role,
  Member,
};
