require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const InvalidDataError = require('../errors/invalid-data-err');
const NotAuthorizedError = require('../errors/not-authorized-err');
const NotFoundError = require('../errors/not-found-err');

const { JWT_SECRET } = process.env;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(new Error('Server Error'));
  }
};

module.exports.getCurrUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new InvalidDataError('wrong data'));
    }
    next(new Error('Server Error'));
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      next(new NotFoundError('User not found'));
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new InvalidDataError('invalid user id'));
    }
    next(new Error('Server Error'));
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'TypeError') {
      next(new InvalidDataError('invalid data passed to the methods for creating a user'));
    } if (err.name === 'MongoServerError') {
      next(new InvalidDataError('This email is already registered in the program'));
    } else {
      next(new Error('Server Error'));
    }
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'TypeError') {
      next(new InvalidDataError('invalid data passed to the methods for creating a user'));
    } else {
      next(new Error('Server Error'));
    }
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'TypeError') {
      next(new InvalidDataError('invalid data passed to the methods for creating a user'));
    } else {
      next(new Error('Server Error'));
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new NotAuthorizedError(err.message));
    });
};
