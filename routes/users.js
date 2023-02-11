const router = require('express').Router();
const {
  sendUsers,
  sendUserById,
  updateUserInfo,
  updateUserAvatar,
  sendUserInfo,
} = require('../controllers/users');

router.get('/', sendUsers); // возвращает всех пользователей
router.get('/me', sendUserInfo); // возвращает информацию о текущем пользователе
router.patch('/me', updateUserInfo); // обновляет профиль
router.patch('/me/avatar', updateUserAvatar); // обновляет аватар
router.get('/:userId', sendUserById); // возвращает пользователя по _id

module.exports = router;
