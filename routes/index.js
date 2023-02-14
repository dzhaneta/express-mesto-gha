const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const errHandler = require('../middlewares/errHandler');
const RegExp = require('../utils/RegExp');

// логгер запросов
router.use(requestLogger);

// роуты, не требующие авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
router.use(auth);

// роуты, которым авторизация нужна
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

// логгер ошибок
router.use(errorLogger);

// обработчик ошибок celebrate
router.use(errors());

// централизованный обработчик ошибок
router.use(errHandler);

module.exports = router;
