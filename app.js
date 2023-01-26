const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63d2bdd31a27f4024e3f2d37',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT);
