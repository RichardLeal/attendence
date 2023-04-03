const express = require('express');
const router = express.Router();
const User = require('./user.schema');

router.post('/login', async (req, res) => {
  const { registration, password, mode } = req.body;
  let role;

  try {
    if (mode === 'web') {
      const user = await User.findOne({ registration, password, role: 'professor' });
      if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }
      role = user.role;
    } else if (mode === 'mobile') {
      const user = await User.findOne({ registration, password, role: 'student' });
      if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }
      role = user.role;
    } else {
      res.status(400).json({ message: 'Invalid mode' });
      return;
    }

    res.json({ name: user.name, registration: user.registration, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
