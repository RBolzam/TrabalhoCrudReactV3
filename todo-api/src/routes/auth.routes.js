const express = require('express');
// Importa os controladores de autenticação (register, login) e operações de usuário
const { register, login } = require('../controllers/auth.controller');
const router = express.Router();
// Importa o middleware de autenticação JWT
const auth = require('../middleware/auth'); 
// Importa funções adicionais do controlador de usuários
const { listUsers, updateUser, deleteUser } = require('../controllers/auth.controller');

// Rota pública para registro de novos usuários (não requer autenticação)
router.post('/register', register);

// Rota pública para login (gera token JWT)
router.post('/login', login); 

// 🔒 Aplica middleware de autenticação em TODAS as rotas abaixo deste ponto
// Qualquer requisição abaixo desta linha exigirá um token JWT válido
router.use(auth);

// ROTAS PROTEGIDAS (requerem autenticação):

// Rota GET para listar todos os usuários (apenas para autenticados)
router.get('/users', listUsers);

// Rota PUT para atualizar um usuário específico por ID
router.put('/users/:id', updateUser); 

// Rota DELETE para remover um usuário específico por ID
router.delete('/users/:id', deleteUser);

// Exporta o roteador configurado
module.exports = router;