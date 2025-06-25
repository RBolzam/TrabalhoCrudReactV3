const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Biblioteca para hash de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para geração de tokens JWT
const prisma = new PrismaClient(); // Instância do cliente Prisma
const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta'; // Chave secreta para JWT

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: 'Email já cadastrado' }); // 409 = Conflito
    }

    // Cria hash da senha (10 rodadas de salt)
    const hashed = await bcrypt.hash(password, 10);
    // Cria o novo usuário no banco de dados
    const user = await prisma.user.create({ data: { email, password: hashed } });

    // Retorna dados do usuário (sem a senha) com status 201 (Created)
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar' }); // Erro genérico do servidor
  }
};

// Função para autenticar usuário e gerar token JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Busca usuário pelo email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' }); // 401 = Não autorizado

  // Compara a senha fornecida com o hash armazenado
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

  // Gera token JWT válido por 1 hora
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  
  // Retorna o token para o cliente
  res.json({ token });
};

// Função para listar todos os usuários (sem informações sensíveis)
exports.listUsers = async (req, res) => {
  try {
    // Busca todos os usuários, excluindo campos sensíveis
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// Função para atualizar dados do usuário
exports.updateUser = async (req, res) => {
  const { id } = req.params; // ID do usuário a ser atualizado
  const { email, password } = req.body;

  try {
    const data = {};
    if (email) data.email = email;
    if (password) {
      // Se houver nova senha, cria um novo hash
      data.password = await bcrypt.hash(password, 10);
    }

    // Atualiza o usuário no banco de dados
    const updated = await prisma.user.update({
      where: { id: parseInt(id) }, // Converte ID para número
      data
    });

    // Retorna confirmação com dados atualizados (sem senha)
    res.json({ message: 'Usuário atualizado', user: { id: updated.id, email: updated.email } });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário' }); // 400 = Bad Request
  }
};

// Função para excluir um usuário
exports.deleteUser = async (req, res) => {
  const { id } = req.params; // ID do usuário a ser excluído

  try {
    // Deleta o usuário do banco de dados
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(204).send(); // 204 = No Content (sucesso sem retorno)
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir usuário' });
  }
};