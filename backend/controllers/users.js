require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;

const INVALID_DATA_ERROR = 400;
const DATA_NOT_FOUND_ERROR = 404;
const DEFAULT_SERVER_ERROR = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(DEFAULT_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(DATA_NOT_FOUND_ERROR).send('user not found');
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(INVALID_DATA_ERROR).send({ message: 'invalid user id' });
    }
    return res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name, about: about, avatar: avatar, email: email , password: hash });
    res.send(user);
  } catch (err) {
    if (err.name === 'TypeError') {
      res.status(INVALID_DATA_ERROR).send('invalid data passed to the methods for creating a user');
    } if (err.name === 'MongoServerError') {
      res.status(INVALID_DATA_ERROR).send({ message: 'This email is already registered in the program' });
    } else {
      res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const updateUserProfile = async (req, res) => {
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
      res.status(INVALID_DATA_ERROR).send('invalid data passed to the methods for creating a user');
    } else {
      res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const updateUserAvatar = async (req, res) => {
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
      res.status(INVALID_DATA_ERROR).send('invalid data passed to the methods for creating a user');
    } else {
      res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
