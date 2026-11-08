const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario !== process.env.API_USER || senha !== process.env.API_PASSWORD) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
  }

  const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  res.json({ token });
});

module.exports = router;