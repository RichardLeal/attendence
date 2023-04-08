const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

function verifyRole(role) {
  return (req, res, next) => {
    // Middleware code
    const regitration = req.body;
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      console.log('decoded', decoded);
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      if(decoded.role !== role)
        return res.status(401).send('Unauthorized');

      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  }
}

function verifyToken(req, res, next) {
  // Middleware code
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    console.log('decoded', decoded);
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken, verifyRole };