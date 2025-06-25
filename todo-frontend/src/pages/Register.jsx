import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Importa a instância configurada do Axios

export default function Register() {
  // Estados para gerenciar os dados do formulário e interface
  const [email, setEmail] = useState(''); // Armazena o email digitado
  const [password, setPassword] = useState(''); // Armazena a senha digitada
  const [showPass, setShowPass] = useState(false); // Controla a visibilidade da senha
  const [errorMsg, setErrorMsg] = useState(''); // Armazena mensagens de erro
  const nav = useNavigate(); // Hook para navegação programática

  // Função para lidar com o envio do formulário
  const handleSubmit = async e => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    
    try {
      // Envia os dados de registro para a API
      await api.post('/auth/register', { email, password });
      
      // Feedback de sucesso e redirecionamento
      alert('Usuário registrado! Faça login.');
      nav('/login'); // Navega para a página de login
    } catch (err) {
      // Tratamento de erros específicos da API
      if (err.response?.status === 409) {
        setErrorMsg('Este email já está em uso.'); // Email duplicado
      } else {
        setErrorMsg('Erro ao registrar. Tente novamente.'); // Erro genérico
      }
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>Registro</h2>

      {/* Exibe mensagem de erro se existir */}
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Formulário de registro */}
      <form onSubmit={handleSubmit}>
        {/* Campo de email */}
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required // Campo obrigatório
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
        <button className="btn btn-success w-100" type="submit">
          Registrar
        </button>
      </form>

      {/* Link para página de login */}
      <div className="text-center mt-3">
        <span>Já tem conta? </span>
        <Link to="/login">Fazer login</Link>
      </div>
    </div>
  );
}