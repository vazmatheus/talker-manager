const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: 'Token not found',
    });
  }

  if (authorization.length !== 16) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ 
      message: 'The "name" field is required',
    });
  }

  if (name.length < 3) {
    return res.status(400).json({ 
      message: 'The "name" must be at least 3 characters long',
    });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({
      message: 'The field "age" is required',
    });
  }

  if (age < 18) {
    return res.status(400).json({ 
      message: 'The person speaking must be of legal age',
    });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || !talk.watchedAt || typeof talk.rate !== 'number') {
    return res.status(400).json({
      message: 'The "talk" field is required and "watchedAt" and "rate" cannot be empty',
    });
  }
  next();
};

const validateDate = (req, res, next) => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/]\d{4}$/i;
  const { talk } = req.body;

  if (!dateRegex.test(talk.watchedAt)) {
    return res.status(400).json({
      message: 'The "watchedAt" field must have the format "dd/mm/yyyy"',
    });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk } = req.body;

  if (!(talk.rate >= 1 && talk.rate <= 5)) {
    return res.status(400).json({ 
      message: 'The "rate" field must be an integer from 1 to 5',
    });
  }
  next();
};

module.exports = {
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
};