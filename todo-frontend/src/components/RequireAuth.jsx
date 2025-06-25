import { Navigate, useLocation } from 'react-router-dom';

// Componente de proteção de rotas que verifica autenticação
export default function RequireAuth({ children }) {
  // 1. Verifica se existe um token JWT no armazenamento local
  const token = localStorage.getItem('token');
  
  // 2. Obtém a localização atual da rota
  const location = useLocation();

  // 3. Verifica se o usuário NÃO está autenticado
  if (!token) {
    // 4. Redireciona para a página de login mantendo o histórico de navegação
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location  // Passa a localização atual para poder voltar após login
        }} 
        replace  // Substitui a entrada no histórico de navegação
      />
    );
  }

  // 5. Se autenticado, renderiza os componentes filhos (rotas protegidas)
  return children;
}