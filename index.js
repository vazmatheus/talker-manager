const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

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

app.listen(PORT, () => {
  console.log('Online');
});
