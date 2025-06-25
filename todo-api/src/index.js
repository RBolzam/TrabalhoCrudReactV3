const express = require('express');
const cors = require('cors'); // Middleware para habilitar CORS
const { PrismaClient } = require('@prisma/client');
const swaggerUI = require('swagger-ui-express'); // Documentação da API
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth.routes'); // Rotas de autenticação
const auth = require('./middleware/auth'); // Middleware de autenticação JWT

const prisma = new PrismaClient(); // Instância do cliente Prisma
const app = express();

// Configuração do CORS para permitir acesso apenas do frontend especificado
app.use(cors({
  origin: 'http://localhost:3000', // Origem permitida (frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Métodos HTTP permitidos
}));

app.use(express.json()); // Habilita parsing de JSON no corpo das requisições

// 📄 Configuração da documentação Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// 🧾 Rotas públicas de autenticação (registro e login)
app.use('/auth', authRoutes);

// 🔐 Rotas protegidas de tarefas (requerem autenticação)
app.use('/tasks', auth, express.Router() // Aplica middleware de autenticação em todas as rotas de tarefas
  // 🔍 Listar todas as tarefas (acessível a todos autenticados)
  .get('/', async (req, res) => {
    try {
      // Busca todas as tarefas no banco de dados
      const tasks = await prisma.task.findMany();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  })

  // 🔍 Buscar tarefa por ID específico
  .get('/:id', async (req, res) => {
    try {
      const taskId = Number(req.params.id); // Converte ID para número
      const task = await prisma.task.findUnique({
        where: { id: taskId }
      });
      
      // Verifica se a tarefa foi encontrada
      task ? res.json(task) : res.status(404).json({ error: 'Tarefa não encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
  })

  // ➕ Criar nova tarefa (vinculada ao usuário logado)
  .post('/', async (req, res) => {
    try {
      const { title, description } = req.body;
      
      // Cria nova tarefa associada ao ID do usuário autenticado
      const task = await prisma.task.create({
        data: {
          title,
          description: description || null, // Aceita descrição opcional
          userId: req.userId // ID do usuário obtido do token JWT
        }
      });
      res.status(201).json(task); // 201 = Created
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar tarefa' });
    }
  })

  // ✏️ Atualizar tarefa (com regras de permissão específicas)
  .put('/:id', async (req, res) => {
    try {
      const taskId = Number(req.params.id);
      
      // Busca tarefa existente
      const task = await prisma.task.findUnique({ where: { id: taskId } });

      // Verifica existência da tarefa
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      // Permissões especiais: verifica se está apenas marcando como completo
      const onlyMarkingCompleted = 
        Object.keys(req.body).length === 1 && // Apenas 1 campo sendo atualizado
        'completed' in req.body; // E esse campo é 'completed'

      // Regra: somente o criador pode editar, exceto para marcação de completo
      if (task.userId !== req.userId && !onlyMarkingCompleted) {
        return res.status(403).json({ error: 'Apenas o criador pode editar esta tarefa' });
      }

      // Atualiza a tarefa
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: req.body // Dados recebidos do corpo da requisição
      });

      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar tarefa' });
    }
  })

  // ❌ Deletar tarefa (somente criador)
  .delete('/:id', async (req, res) => {
    try {
      const taskId = Number(req.params.id);
      
      // Busca tarefa para verificar permissões
      const task = await prisma.task.findUnique({ where: { id: taskId } });

      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      
      // Verifica se o usuário atual é o criador da tarefa
      if (task.userId !== req.userId) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir esta tarefa' });
      }

      // Exclui a tarefa
      await prisma.task.delete({ where: { id: taskId } });
      res.status(204).end(); // 204 = No Content (sucesso sem retorno)
    } catch (error) {
      res.status(400).json({ error: 'Erro ao excluir tarefa' });
    }
  })
);

// Inicialização do servidor
const PORT = process.env.PORT || 5000; // Usa porta do ambiente ou 5000
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
  console.log(`📄 Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
});