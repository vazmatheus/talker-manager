const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const generateToken = require('./helpers/generateToken');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const {
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
} = require('./middlewares/validateTalker');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const data = fs.readFileSync('talker.json', 'utf8');
  return res.status(200).json(JSON.parse(data));
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync('talker.json', 'utf8');
  const talkers = JSON.parse(data).find((talker) => talker.id === Number(id));
  if (!talkers) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(talkers);
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  res.status(200).json({ token: generateToken() });
});

app.post('/talker', validateToken, validateName, validateAge, validateTalk, validateDate,
  validateRate,
  (req, res) => {
    const { name, age, talk } = req.body;
    const data = fs.readFileSync('./talker.json', 'utf-8');
    const talker = JSON.parse(data);
    const id = talker.length + 1;
    const obj = { id, name, age, talk };
    const talkers = [...talker, obj];
    fs.writeFileSync('./talker.json', JSON.stringify(talkers));
    return res.status(201).json(obj);
});

app.put('/talker/:id', validateToken, validateName, validateAge, validateTalk, validateDate,
  validateRate,
  (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const data = fs.readFileSync('./talker.json', 'utf-8');
    const talkers = JSON.parse(data);
    const talkerFinded = talkers.find((talker) => talker.id === Number(id));
    const index = talkers.indexOf(talkerFinded);
    const obj = { id: Number(id), name, age, talk };
    talkers.splice(index, 1, obj);
    fs.writeFileSync('./talker.json', JSON.stringify(talkers));
    return res.status(200).json(obj);
});

app.listen(PORT, () => {
  console.log('Online');
});
