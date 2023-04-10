const express = require('express');
const router = express.Router();
const User = require('./user.schema');

const UserRole = require('./user-role.const');
const Mode = require('./mode.const');

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'mysecretkey';

router.post('/login', async (req, res) => {
  const { registration, password, mode } = req.body;

  let role;
  let user;

  try {
    if (mode === Mode.WEB) {
      user = await User.findOne({ registration, password, role: UserRole.PROFESSOR });
      if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }
      role = user.role;
    } else if (mode === Mode.MOBILE) {
      user = await User.findOne({ registration, password, role: UserRole.STUDENT });
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
    const token = jwt.sign({ registration: user.registration, role }, secretKey, { expiresIn: '5m' });

    res.json({ name: user.name, registration: user.registration, role, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
