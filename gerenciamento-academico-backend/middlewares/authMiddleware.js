const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua-chave-secreta-super-longa-e-segura-aqui'; // A mesma chave secreta

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Nenhum token fornecido.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Erro no token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token mal formatado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token inválido.' });
    }
    
    req.userId = decoded.id; // Adiciona o ID do usuário na requisição
    return next();
  });
};