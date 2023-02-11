const Card = require('../models/card');
const Err = require('../utils/error-codes');

module.exports.sendCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res
      .status(Err.INTERNAL_SERVER_ERR_CODE)
      .send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(Err.BAD_INPUT_ERR_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      return res
        .status(Err.INTERNAL_SERVER_ERR_CODE)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(Err.NOT_FOUND_ERR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }

      if (card.owner !== req.user._id) {
        return res
          .status(403)
          .send({ message: 'Нельзя удалить карточку другого пользователя' });
      }

      return card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(Err.BAD_INPUT_ERR_CODE)
          .send({ message: 'Переданы некорректные данные при удалении карточки.' });
      }

      res
        .status(Err.INTERNAL_SERVER_ERR_CODE)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
      upsert: false,
    },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(Err.NOT_FOUND_ERR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(Err.BAD_INPUT_ERR_CODE)
          .send({ message: 'Передан невалидный _id карточки.' });
      }

      return res
        .status(Err.INTERNAL_SERVER_ERR_CODE)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
      upsert: false,
    },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(Err.NOT_FOUND_ERR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(Err.BAD_INPUT_ERR_CODE)
          .send({ message: 'Передан невалидный _id карточки.' });
      }

      return res
        .status(Err.INTERNAL_SERVER_ERR_CODE)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};
