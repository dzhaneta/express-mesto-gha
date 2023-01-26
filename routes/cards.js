const router = require('express').Router();
const { sendCards, createCard, deleteCardById } = require('../controllers/cards');

router.get('/', sendCards); // возвращает все карточки
router.post('/', createCard); // создаёт карточку
router.delete('/:cardId', deleteCardById); // удаляет карточку по идентификатору

module.exports = router;
