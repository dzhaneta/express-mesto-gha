const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  sendCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const RegExp = require('../utils/RegExp');

router.get('/', sendCards); // возвращает все карточки

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(RegExp),
  }),
}), createCard); // создаёт карточку

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCardById); // удаляет карточку по идентификатору

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard); // поставить лайк карточке

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard); // убрать лайк с карточки

module.exports = router;
