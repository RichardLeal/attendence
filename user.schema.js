const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  registration: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['STUDENT', 'PROFESSOR'],
  },
});

module.exports = mongoose.model('User', userSchema, 'users');
