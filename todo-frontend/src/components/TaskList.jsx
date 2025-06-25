import { useEffect, useState } from 'react';
import api from '../api'; // ✅ Instância do Axios configurada com autenticação
import { Link } from 'react-router-dom';
import { parseJwt } from '../components/Auth'; // ✅ Função para decodificar token JWT
import { ListGroup, Button, Badge } from 'react-bootstrap';
import { PencilSquare, Trash, Check2Circle } from 'react-bootstrap-icons';

const TaskList = () => {
  // Estado para armazenar a lista de tarefas
  const [tasks, setTasks] = useState([]);
  
  // Extrai o ID do usuário do token JWT armazenado
  const userId = parseJwt(localStorage.getItem('token'))?.userId;

  // Efeito para carregar tarefas ao montar o componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Busca tarefas da API
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };
    fetchTasks();
  }, []); // Executa apenas uma vez

  // Função para excluir uma tarefa
  const handleDelete = async (id) => {
    try {
      // Confirmação antes de excluir
      if (window.confirm('Deseja excluir esta tarefa?')) {
        await api.delete(`/tasks/${id}`);
        // Atualiza estado removendo a tarefa excluída
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  // Função para marcar tarefa como concluída
  const handleComplete = async (id) => {
    try {
      // Atualiza apenas o campo 'completed' no backend
      await api.put(`/tasks/${id}`, { completed: true });
      // Atualiza estado local marcando a tarefa como concluída
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: true } : task
      ));
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Cabeçalho com título e botão para nova tarefa */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Tarefas</h1>
        <Link to="/new" className="btn btn-primary">
          Nova Tarefa
        </Link>
      </div>

      {/* Lista de tarefas usando componente do Bootstrap */}
      <ListGroup>
        {tasks.map(task => (
          <ListGroup.Item
            key={task.id}
            className="d-flex justify-content-between align-items-start"
            variant={task.completed ? 'success' : ''} // Destaca tarefas concluídas
          >
            {/* Conteúdo principal da tarefa */}
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                {task.title}
                {/* Badge para tarefas concluídas */}
                {task.completed && (
                  <Badge bg="success" className="ms-2">Concluída</Badge>
                )}
              </div>
              {/* Descrição da tarefa */}
              {task.description}
            </div>

            {/* Grupo de botões de ação */}
            <div className="d-flex gap-2">
              {/* Botão para marcar como concluída (só aparece se não estiver concluída) */}
              {!task.completed && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleComplete(task.id)}
                  title="Marcar como concluída"
                >
                  <Check2Circle />
                </Button>
              )}

              {/* Botões de edição/exclusão (só aparecem para o dono da tarefa) */}
              {task.userId === userId && (
                <>
                  {/* Link para edição da tarefa */}
                  <Link
                    to={`/edit/${task.id}`}
                    className="btn btn-outline-primary btn-sm"
                    title="Editar tarefa"
                  >
                    <PencilSquare />
                  </Link>
                  {/* Botão para exclusão da tarefa */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                    title="Excluir tarefa"
                  >
                    <Trash />
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Mensagem para lista vazia */}
      {tasks.length === 0 && (
        <div className="text-center mt-4 text-muted">
          Nenhuma tarefa encontrada
        </div>
      )}
    </div>
  );
};

export default TaskList;