import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Importa a instância do Axios configurada
import { Form, Button, Alert } from 'react-bootstrap'; // Componentes do Bootstrap para formulário

const TaskForm = () => {
  // Extrai o ID da tarefa da URL (se estiver em modo de edição)
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegação programática
  
  // Estado para armazenar os dados da tarefa
  const [task, setTask] = useState({
    title: '',
    description: '',
    completed: false
  });
  
  // Estados para feedback ao usuário
  const [error, setError] = useState(''); // Mensagens de erro
  const [success, setSuccess] = useState(''); // Mensagens de sucesso
  const [validated, setValidated] = useState(false); // Controle de validação do formulário

  // Efeito para carregar tarefa existente quando em modo de edição
  useEffect(() => {
    // Se não houver ID, está criando nova tarefa (não carrega dados)
    if (!id) return;

    // Função assíncrona para buscar dados da tarefa
    const fetchTask = async () => {
      try {
        // Busca tarefa específica da API
        const response = await api.get(`/tasks/${id}`);
        // Preenche o estado com os dados recebidos
        setTask({
          title: response.data.title,
          description: response.data.description || '', // Trata descrição opcional
          completed: response.data.completed
        });
      } catch (err) {
        setError('Falha ao carregar a tarefa');
        console.error(err);
        navigate('/'); // Redireciona para lista em caso de erro
      }
    };

    fetchTask();
  }, [id, navigate]); // Dependências: executa quando ID ou navigate mudam

  // Manipulador de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne comportamento padrão do formulário
    setError(''); // Reseta mensagens anteriores
    setSuccess('');
    setValidated(true); // Ativa validações visuais

    // Validação manual do título (campo obrigatório)
    if (!task.title.trim()) {
      setError('O título é obrigatório');
      return;
    }

    try {
      if (id) {
        // Modo edição: PUT para atualizar tarefa existente
        await api.put(`/tasks/${id}`, task);
        setSuccess('Tarefa atualizada com sucesso!');
      } else {
        // Modo criação: POST para nova tarefa
        await api.post('/tasks', task);
        setSuccess('Tarefa criada com sucesso!');
        // Reseta formulário após criação bem-sucedida
        setTask({ title: '', description: '', completed: false });
        setValidated(false); // Desativa estados de validação
      }

      // Redireciona para lista de tarefas após 1 segundo
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      // Exibe erro específico da API ou mensagem genérica
      setError(err.response?.data?.error || 'Erro ao salvar tarefa');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>

      {/* Exibe alertas de erro/sucesso */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Formulário com validação */}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* Campo de título (obrigatório) */}
        <Form.Group className="mb-3">
          <Form.Label>Título *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
            isInvalid={validated && !task.title.trim()} // Destaca campo inválido
          />
          <Form.Control.Feedback type="invalid">
            Título é obrigatório.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Campo de descrição (opcional) */}
        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
        </Form.Group>

        {/* Checkbox para status de conclusão */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Concluída"
            checked={task.completed}
            onChange={(e) => setTask({ ...task, completed: e.target.checked })}
          />
        </Form.Group>

        {/* Botões de ação */}
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {id ? 'Atualizar Tarefa' : 'Criar Tarefa'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TaskForm;