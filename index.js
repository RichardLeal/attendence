const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticate = require('./middleware.function');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://attendence:att-lab-soft-2022-2@attendance.wua72ln.mongodb.net/Attendance?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB connected!');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const checkInRoute = require('./check-in.route');
app.use('/check-in', authenticate.authenticate, checkInRoute);

const authenticationRoute = require('./authentication.route');
app.use('/auth', authenticationRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
