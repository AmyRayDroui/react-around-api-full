const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {celebrate, Joi} = require('celebrate');

const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');

const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());
app.use(bodyParser.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
    avatar: Joi.string().min(2),
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
  }),
}),createUser);
app.post('/signin', login);

app.use(auth);

app.use((req, res, next) => {
  req.user = {
    _id: '62645d1bbe77bd89503983ae',
  };

  next();
});
app.use('/cards', cardsRoute);
app.use('/users', usersRoute);
app.get('/:extra', (req, res) => {
  res.status(404);
  res.setHeader('Content-Type', 'application/json');
  res.send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
