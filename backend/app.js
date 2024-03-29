const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');

const NotFoundError = require('./errors/not-found-err');

const { requestLogger, errorLogger } = require('./middleware/logger');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');

const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
    avatar: Joi.string().min(2),
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
  }),
}), login);

app.use(auth);

app.use('/cards', cardsRoute);
app.use('/users', usersRoute);
app.get('/', () => {
  throw new NotFoundError('Requested resource not found');
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
