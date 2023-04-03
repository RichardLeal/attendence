const express = require('express');
const router = express.Router();
const User = require('./user.schema');

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'mysecretkey';

router.post('/login', async (req, res) => {
  const { registration, password, mode } = req.body;
  let role;
  let user;

  try {
    if (mode === 'web') {
      user = await User.findOne({ registration, password, role: 'professor' });
      if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }
      role = user.role;
    } else if (mode === 'mobile') {
      user = await User.findOne({ registration, password, role: 'student' });
      if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }
      role = user.role;
    } else {
      res.status(400).json({ message: 'Invalid mode' });
      return;
    }

    // Create a JWT token with the user's registration and role
    const token = jwt.sign({ registration: user.registration, role }, secretKey);

    res.json({ name: user.name, registration: user.registration, role, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});


module.exports = router;
