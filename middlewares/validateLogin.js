const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) { 
    return res.status(400).json({
    message: 'The "email" field is required',
    });
  }
  
  if (!(email.includes('@') && email.includes('.com'))) { 
    return res.status(400).json({
    message: 'The "email" must have the format "user@eexamplemail.com"',
    });
  }
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) { 
    return res.status(400).json({
    message: 'The "password" field is required',
    });
  }
  
  if ((password.length < 6)) { 
    return res.status(400).json({
    message: 'The "password" must be at least 6 characters long',
    });
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
};
