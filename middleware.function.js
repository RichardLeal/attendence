const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'mysecretkey';

function authenticate(req, res, next) {
    // Middleware code
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  };

  module.exports = { authenticate, secretKey }