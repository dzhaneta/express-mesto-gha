const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const RegExp = require('../utils/RegExp');

const {
  sendUsers,
  sendUserById,
  updateUserInfo,
  updateUserAvatar,
  sendUserInfo,
} = require('../controllers/users');

router.get('/', sendUsers); // возвращает всех пользователей
router.get('/me', sendUserInfo); // возвращает информацию о текущем пользователе

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo); // обновляет профиль

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(RegExp),
  }),
}), updateUserAvatar); // обновляет аватар

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), sendUserById); // возвращает пользователя по _id

module.exports = router;
