const express = require('express');
const router = express.Router();
const CheckIn = require('./check-in.schema');

router.post('/', async (req, res) => {
  const { code, registration } = req.body;

  try {
    const checkIn = await CheckIn.findOne({ code });
    if (!checkIn) {
      res.status(400).json({ message: 'Invalid check-in code' });
      return;
    }

    const student = checkIn.students.find((s) => s.registration === registration);
    if (!student) {
      res.status(400).json({ message: 'Student not found in check-in' });
      return;
    }

    res.json({ message: 'Check-in successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const checkIns = await CheckIn.find();
    res.json(checkIns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
