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
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await user.verifyPassword(senha);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Configurar o cookie HTTP-only com o token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS em produção
      sameSite: 'strict',
      maxAge: 3600000 // 1 hora em milissegundos
    });

    // Enviar resposta de sucesso sem expor o token
    res.json({ message: 'Login realizado com sucesso' });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
