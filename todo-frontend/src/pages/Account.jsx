import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importa a instância do Axios configurada

export default function Account() {
  // Estados para gerenciar os dados do usuário e formulário
  const [user, setUser] = useState({}); // Armazena dados completos do usuário
  const [email, setEmail] = useState(''); // Armazena email para edição
  const [password, setPassword] = useState(''); // Armazena nova senha
  const nav = useNavigate(); // Hook para navegação programática

  // Efeito para carregar os dados do usuário ao montar o componente
  useEffect(() => {
    api.get('/auth/users')
      .then(res => {
        // Decodifica o token JWT para obter o ID do usuário logado
        const decoded = parseJwt(localStorage.getItem('token'));
        
        // Encontra o usuário atual na lista de usuários
        const me = res.data.find(u => u.id === decoded.userId);
        
        // Atualiza os estados com os dados do usuário
        setUser(me);
        setEmail(me.email);
      });
  }, []); // Array vazio garante que executa apenas uma vez

  // Função para atualizar os dados da conta
  const handleUpdate = async () => {
    // Envia requisição para atualizar email e/ou senha
    await api.put(`/auth/users/${user.id}`, { email, password });
    // Feedback visual de sucesso
    alert('Conta atualizada!');
  };

  // Função para excluir a conta permanentemente
  const handleDelete = async () => {
    // Confirmação explícita antes da exclusão permanente
    if (window.confirm('Tem certeza que deseja excluir sua conta?')) {
      // Requisição para deletar o usuário no backend
      await api.delete(`/auth/users/${user.id}`);
      
      // Remove o token de autenticação do armazenamento local
      localStorage.removeItem('token');
      
      // Feedback e redirecionamento para registro
      alert('Conta deletada!');
      nav('/register'); // Redireciona para página de registro
    }
  };

  // Função para logout sem excluir a conta
  const handleLogout = () => {
    // Remove o token de autenticação mas mantém a conta
    localStorage.removeItem('token');
    // Redireciona para página de login
    nav('/login'); 
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>Minha Conta</h2>
      
      {/* Seção de edição de email */}
      <div className="mb-2">
        <label>Email</label>
        <input 
          className="form-control" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
        />
      </div>
      
      {/* Seção para alteração de senha */}
      <div className="mb-2">
        <label>Nova senha</label>
        <input 
          className="form-control" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          type="password" 
          placeholder="Deixe em branco para manter a atual"
        />
      </div>
      
      {/* Grupo de botões para ações principais */}
      <button className="btn btn-primary me-2" onClick={handleUpdate}>
        Salvar alterações
      </button>
      <button className="btn btn-danger me-2" onClick={handleDelete}>
        Excluir conta
      </button>

      <hr /> {/* Divisor visual */}
      
      {/* Rodapé com navegação secundária */}
      <div className="d-flex justify-content-between">
        {/* Botão para voltar à página inicial */}
        <button className="btn btn-secondary" onClick={() => nav('/')}>
          ← Voltar
        </button>
        
        {/* Botão para logout da aplicação */}
        <button className="btn btn-warning" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

// Função auxiliar para decodificar tokens JWT
function parseJwt(token) {
  try {
    // Decodifica a parte do payload do token (base64)
    // 1. Divide o token em partes [header, payload, signature]
    // 2. Pega a parte do payload (índice 1)
    // 3. Decodifica de base64 para string
    // 4. Converte a string JSON para objeto JavaScript
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    // Retorna objeto vazio em caso de erro:
    // - Token malformado
    // - Problema na decodificação
    return {};
  }
}