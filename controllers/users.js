const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Err = require('../utils/error-codes');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      // вернём токен, записав его в httpOnly куку
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.sendUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.sendUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(Err.NOT_FOUND_ERR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.sendUserInfo = (req, res) => {
  const ownerId = req.user._id;
  User.findById(ownerId)
    .then((userInfo) => {
      if (!userInfo) {
        return res.status(Err.NOT_FOUND_ERR_CODE).send({ message: 'Пользователь не найден.' });
      }
      return res.send({ data: userInfo });
    })
    .catch(() => {
      res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
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
    .then((user) => {
      if (!user) {
        return res.status(Err.NOT_FOUND_ERR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }

      if (err.name === 'CastError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Передан невалидный _id для обновления профиля.' });
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
    .then((user) => {
      if (!user) {
        return res.status(Err.NOT_FOUND_ERR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      if (err.name === 'CastError') {
        return res.status(Err.BAD_INPUT_ERR_CODE).send({ message: 'Передан невалидный _id для обновления аватара профиля.' });
      }

      return res.status(Err.INTERNAL_SERVER_ERR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};
