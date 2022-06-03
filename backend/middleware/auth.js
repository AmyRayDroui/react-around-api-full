require('dotenv').config();
const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/forbidden-err');
const NotAuthorizedError = require('../errors/not-authorized-err');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ForbiddenError('Authorization Required'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthorizedError('Authorization Required'));
  }

  req.user = payload;
  next();
};
