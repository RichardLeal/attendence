const express = require('express');
const router = express.Router();
const CheckIn = require('./check-in.schema');
const HistoryCheckIn = require('./history-check-in.schema');
const UserRole = require('./user-role.const');
const middleware = require('./middleware.function');
const moment = require('moment-timezone');

router.get('/code/:registration', middleware.verifyRole(UserRole.PROFESSOR), async (req, res) => {
  const { registration } = req.params;

  try {
    const now = moment();
    const dayOfWeek = 'repeatingDays.' + now.format('dddd').toLowerCase();

    const checkIns = await CheckIn.find({
      'professor.registration': registration,
      [dayOfWeek]: true,
      'holidaysOrDaysOff.date': { $ne: now },
      'semester.startAt': { $lte: now },
      'semester.endAt': { $gte: now }
    });

    const nowOnlyDate = now.format('YYYY-MM-DD');
    const checkIn = checkIns.find(checkIn => {
      const nowOnlyDateConcatWithStartAt = moment(nowOnlyDate + checkIn.time.startAt);
      const nowOnlyDateConcatWithEndAt = moment(nowOnlyDate + checkIn.time.endAt);

      return now >= nowOnlyDateConcatWithStartAt && now <= nowOnlyDateConcatWithEndAt; 
    });

    if (!checkIn) {
      res.status(404).json({ message: 'Check-in not found' });
      return null;
    }

    res.json({ class: checkIn.class, semester: { name: checkIn.semester.name }, code: checkIn.code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

router.post('/', middleware.verifyRole(UserRole.STUDENT), async (req, res) => {
  const { code, registration } = req.body;

  try {
    const checkIn = await CheckIn.findOne({ code });
    if (!checkIn) {
      res.status(400).json({ message: 'Invalid check-in code' });
      return null;
    }

    // Check if student is part of class
    const student = checkIn.students.find((s) => s.registration === registration);
    if (!student) {
      res.status(400).json({ message: 'Student not found in check-in' });
      return null;
    }

    // Check the day of week
    const now = moment();
    const dayOfWeek = now.format('dddd').toLowerCase();
    if (!checkIn.repeatingDays[dayOfWeek]) {
      res.status(400).json({ message: 'Today is not a valid check-in day' });
      return null;
    }

    // Check if today is holiday or day off
    const isHolidayOrDayOff = checkIn.holidaysOrDaysOff.some((holidayOrDayOff) => {
      const holidayOrDayOffDate = moment(holidayOrDayOff.date).format('YYYY-MM-DD');
      const nowOnlyDate = now.format('YYYY-MM-DD');

      return holidayOrDayOffDate === nowOnlyDate;
    });
    if (isHolidayOrDayOff) {
      res.status(400).json({ message: 'Today is a holiday or day off' });
      return null
    }

    // Check if check in is in semester period
    const semesterStart = moment(checkIn.semester.startAt);
    const semesterEnd = moment(checkIn.semester.endAt);
    if (now < semesterStart || now > semesterEnd) {
      res.status(400).json({ message: 'Check-in is outside the semester period' });
      return null;
    }
    
     // Check if check in is in time range
    const nowOnlyDate = now.format('YYYY-MM-DD');
    const nowOnlyDateConcatWithStartAt = moment(nowOnlyDate + checkIn.time.startAt);
    const nowOnlyDateConcatWithEndAt = moment(nowOnlyDate + checkIn.time.endAt);
    if (now < nowOnlyDateConcatWithStartAt || now > nowOnlyDateConcatWithEndAt) {
      res.status(400).json({ message: 'Check-in is outside the time range' });
      return null;
    }
    
    // Check if check-in in already done
    const historyCheckInIfAlreadyDone = await HistoryCheckIn.find({
      'student.registration': registration,
      'semester.name': checkIn.semester.name,
      'checkIn.class.code': checkIn.class.code,
      'checkIn.date': { $gte: nowOnlyDateConcatWithStartAt, $lte: nowOnlyDateConcatWithEndAt }
    });
    if(historyCheckInIfAlreadyDone.length > 0){
      res.status(406).json({ message: 'Check-in in already done' });
      return null;
    }
    // Create a check in in check in list of student
    const historyCheckIn = await HistoryCheckIn.updateOne({
      'student.registration': registration,
      'semester.name': checkIn.semester.name
    },{
      student: student,
      semester: checkIn.semester,
      $push: {
        checkIn: { 
          class: checkIn.class,
          date: now
        }
      }
    }, { upsert: true });

    res.json({ message: 'Check-in successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

router.get('/all', middleware.verifyRole(UserRole.PROFESSOR), async (req, res) => {
  const { registration } = req.body;

  try {  
    const checkIns = await CheckIn.find({ 'professor.registration': registration });
    res.json(checkIns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
