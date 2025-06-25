import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api'; // Importa a instância do Axios configurada

export default function Login() {
  // Estados para gerenciar os dados do formulário e interface
  const [email, setEmail] = useState(''); // Armazena o email digitado
  const [password, setPassword] = useState(''); // Armazena a senha digitada
  const [errorMsg, setErrorMsg] = useState(''); // Armazena mensagens de erro
  const [showPass, setShowPass] = useState(false); // Controla a visibilidade da senha
  
  // Hooks para navegação e acesso à localização atual
  const nav = useNavigate(); // Permite navegação programática
  const location = useLocation(); // Acessa informações da rota atual
  
  // Recupera a localização anterior para redirecionamento pós-login
  // Se existir state.from, usa o pathname, senão redireciona para raiz ('/')
  const from = location.state?.from?.pathname || '/';

  // Função para lidar com o envio do formulário
  const handleSubmit = async e => {
    e.preventDefault(); // Previne recarregamento da página
    
    try {
      // Envia credenciais para a API de login
      const { data } = await api.post('/auth/login', { email, password });
      
      // Armazena o token JWT no localStorage do navegador
      localStorage.setItem('token', data.token);
      
      // Redireciona para a rota de origem (ou raiz) substituindo histórico
      nav(from, { replace: true });
      
    } catch (err) {
      console.error(err); // Log de erro para desenvolvimento
      setErrorMsg('Email ou senha incorretos.'); // Feedback ao usuário
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">Login</h2>

      {/* Exibe mensagem de erro se existir */}
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
        {/* Campo de email */}
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required // Campo obrigatório
          autoFocus // Foco automático ao carregar
        />
        
        {/* Campo de senha com toggle de visibilidade */}
        <input
          className="form-control mb-2"
          type={showPass ? "text" : "password"} // Alterna entre texto e password
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required // Campo obrigatório
        />
        
        {/* Checkbox para mostrar/ocultar senha */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="showPassword"
            checked={showPass}
            onChange={() => setShowPass(!showPass)} // Alterna estado de visibilidade
          />
          <label className="form-check-label" htmlFor="showPassword">
            Mostrar senha
          </label>
        </div>
        
        {/* Botão de submissão */}
        <button className="btn btn-primary w-100" type="submit">
          Entrar
        </button>
      </form>

      {/* Link para página de registro */}
      <div className="text-center mt-3">
        <span>Não tem conta? </span>
        <Link to="/register">Registre-se aqui</Link>
      </div>
    </div>
  );
}