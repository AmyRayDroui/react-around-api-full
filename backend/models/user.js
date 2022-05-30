const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return v.match(/^https?:\/\/(www.)?(\w|[.\-~:/?%#[\]@!$&'()*+,;=])+/);
      },
      message: 'the url is not valid',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'the email is not valid',
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
});

module.exports = mongoose.model('user', userSchema);
