const Card = require('../models/card');

const INVALID_DATA_ERROR = 400;
const UNAUTHORIZED_USER = 403;
const DATA_NOT_FOUND_ERROR = 404;
const DEFAULT_SERVER_ERROR = 500;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate('owner');
    res.send(cards);
  } catch (err) {
    res.status(DEFAULT_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'TypeError') {
      res.status(INVALID_DATA_ERROR).send('invalid data passed to the methods for creating a card');
    } else {
      res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    searchCard = await Card.findById(req.params.id);
    if (searchCard === null) {
      return res.status(DATA_NOT_FOUND_ERROR).send({ message:'Card not found' });
    }
    if (req.user._id !== searchCard.owner.toHexString()) {
      return res.status(UNAUTHORIZED_USER).send({ message: 'Not the owner of the card' });
    }
    const card = await Card.findByIdAndRemove(req.params.id);
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(INVALID_DATA_ERROR).send({ message: 'invalid card' });
    }
    return res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res.status(DATA_NOT_FOUND_ERROR).send('Card not found');
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(INVALID_DATA_ERROR).send({ message: 'invalid card' });
    }
    return res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res.status(DATA_NOT_FOUND_ERROR).send('Card not found');
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(INVALID_DATA_ERROR).send({ message: 'invalid card' });
    }
    return res.status(DEFAULT_SERVER_ERROR).send({ message: 'Error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
