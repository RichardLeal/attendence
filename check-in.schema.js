const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  code: String,
  professor: {
    name: String,
    registration: String,
  },
  students: [
    {
      name: String,
      registration: String,
    },
  ],
  class: {
    code: String,
    name: String,
  },
  repeatingDays: {
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean,
  },
  holidaysOrDaysOff: [
    {
      name: String,
      date: Date,
    },
  ],
  semester: {
    name: String,
    startAt: Date,
    endAt: Date,
  },
  time: {
    startAt: String,
    endAt: String,
  },
});

module.exports = mongoose.model('CheckIn', checkInSchema, 'check_ins');
