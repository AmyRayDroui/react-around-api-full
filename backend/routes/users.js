const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../validators/validateUrl');

const {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrUser);
router.get('/:id', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).custom(validateUrl),
  }),
}), updateUserAvatar);

module.exports = router;
