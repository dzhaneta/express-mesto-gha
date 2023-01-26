const router = require('express').Router();
const { sendUsers, sendUserById, createUser } = require('../controllers/users');

router.get('/', sendUsers); // возвращает всех пользователей
router.get('/:userId', sendUserById); // возвращает пользователя по _id
router.post('/', createUser); // создаёт пользователя

module.exports = router;
