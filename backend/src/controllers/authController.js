const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { nome_user, senha } = req.body;

  if (!nome_user || !senha) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios' });
  }

  try {
    const user = await User.findByNomeUser(nome_user);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await user.verifyPassword(senha);

    if (!isMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ userId: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
