// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o email já está em uso
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // Criar novo usuário (a senha será criptografada pelo hook no modelo)
    const user = await User.create({ email, password });

    // Gerar um token imediatamente após o registro
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Enviar o token para o frontend
    res.status(201).json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
}); 

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Comparar a senha informada com a armazenada
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,  // A chave secreta do JWT, que deve ser definida no .env
      { expiresIn: '1h' }     // O token expira após 1 hora
    );

    // Enviar o token para o frontend
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao autenticar', error });
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validação simples de senha
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'A senha precisa ter no mínimo 6 caracteres.' });
  }

  try {
    // Verificar se o email já está em uso
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // Criar novo usuário (a senha será criptografada automaticamente pelo hook no modelo User.js)
    const user = await User.create({ email, password });

    // Gerar um token JWT para que o usuário seja logado automaticamente após o registro
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Enviar o token para o frontend
    res.status(201).json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
});

module.exports = router;
