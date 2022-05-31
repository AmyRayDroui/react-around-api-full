const Card = require('../models/card');
const InvalidDataError = require('../errors/invalid-data-err');
const NotAuthorizedError = require('../errors/not-authorized-err');
const NotFoundError = require('../errors/not-found-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({})
      .populate('owner');
    res.send(cards);
  } catch (err) {
    next(new Error('Server Error'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'TypeError') {
      next(new InvalidDataError('invalid data passed to the methods for creating a card'));
    } else {
      next(new Error('Server Error'));
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const searchCard = await Card.findById(req.params.id);
    if (searchCard === null) {
      next(new NotFoundError('Card not found'));
    }
    if (req.user._id !== searchCard.owner.toHexString()) {
      next(new NotAuthorizedError('Not the owner of the card'));
    }
    const card = await Card.findByIdAndRemove(req.params.id);
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new InvalidDataError('invalid card'));
    }
    next(new Error('Server Error'));
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      next(new NotFoundError('Card not found'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new InvalidDataError('invalid card'));
    }
    next(new Error('Server Error'));
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      next(new NotFoundError('Card not found'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new InvalidDataError('invalid card'));
    }
    next(new Error('Server Error'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
