require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Err = require('./utils/error-codes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

// роуты, не требующие авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(Err.NOT_FOUND_ERR_CODE).send({ message: 'Указанная страница не найдена.' });
});

app.listen(PORT);
