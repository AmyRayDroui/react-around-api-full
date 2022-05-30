const User = require('../models/user');

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
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'TypeError') {
      res.status(INVALID_DATA_ERROR).send('invalid data passed to the methods for creating a user');
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
