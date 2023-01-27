const User = require('../models/user');
const Err = require('../utils/error-codes');

module.exports.sendUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.sendUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(Err.NOT_FOUND_ERR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const ownerId = req.user._id;

  User.findByIdAndUpdate(
    ownerId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }

      if (err.name === 'CastError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const ownerId = req.user._id;

  User.findByIdAndUpdate(
    ownerId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      if (err.name === 'CastError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};
