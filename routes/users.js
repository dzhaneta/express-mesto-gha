const router = require('express').Router();
const {
  sendUsers, sendUserById, createUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', sendUsers); // возвращает всех пользователей
router.get('/:userId', sendUserById); // возвращает пользователя по _id
router.post('/', createUser); // создаёт пользователя
router.patch('/me', updateUserInfo); // обновляет профиль
router.patch('/me/avatar', updateUserAvatar); // обновляет аватар

module.exports = router;
