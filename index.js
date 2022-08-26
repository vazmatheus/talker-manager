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

const talkerJson = 'talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const data = fs.readFileSync(talkerJson, 'utf8');
  return res.status(200).json(JSON.parse(data));
});

app.get('/talker/search', validateToken, (req, res) => {
  const { q } = req.query;
  const data = fs.readFileSync(talkerJson, 'utf-8');
  const talkers = JSON.parse(data);
  const talkerFilter = talkers.filter((talker) => talker.name.includes(q));

  return res.status(200).json(talkerFilter);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync(talkerJson, 'utf8');
  const talkers = JSON.parse(data).find((talker) => talker.id === Number(id));
  if (!talkers) {
    return res.status(404).json({
      message: 'Speaker not found',
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
    const data = fs.readFileSync(talkerJson, 'utf-8');
    const talker = JSON.parse(data);
    const id = talker.length + 1;
    const obj = { id, name, age, talk };
    const talkers = [...talker, obj];
    fs.writeFileSync(talkerJson, JSON.stringify(talkers));
    return res.status(201).json(obj);
});

app.put('/talker/:id', validateToken, validateName, validateAge, validateTalk, validateDate,
  validateRate,
  (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const data = fs.readFileSync(talkerJson, 'utf-8');
    const talkers = JSON.parse(data);
    const talkerFinded = talkers.find((talker) => talker.id === Number(id));
    const index = talkers.indexOf(talkerFinded);
    const obj = { id: Number(id), name, age, talk };
    talkers.splice(index, 1, obj);
    fs.writeFileSync(talkerJson, JSON.stringify(talkers));
    return res.status(200).json(obj);
});

app.delete('/talker/:id', validateToken, (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync(talkerJson, 'utf8');
  const talkers = JSON.parse(data);
  const talkerId = talkers.find((talker) => talker.id === parseInt(id, 0));

  fs.writeFileSync(talkerJson, JSON.stringify(talkers.slice(talkerId, 1)));

  return res.status(204).end();
}); 

app.listen(PORT, () => {
  console.log('Online');
});