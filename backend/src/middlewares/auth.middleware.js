const jwt = require('jsonwebtoken');
const { Unauthenticated } = require('../utils/response');
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith('Bearer')) return Unauthenticated(res);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return Unauthenticated(res); // invalid token
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
