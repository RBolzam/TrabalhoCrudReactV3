import { useRouteError, useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';

// Componente para exibição de erros globais da aplicação
export default function ErrorPage() {
  // Hook para acessar informações do erro de roteamento
  const error = useRouteError();
  
  // Hook para navegação programática
  const navigate = useNavigate();

  // Estrutura os detalhes do erro de forma padronizada
  const errorDetails = {
    title: 'Erro inesperado!', // Título padrão para erros
    message: error.data?.message || error.message, // Mensagem específica ou genérica
    code: error.status || 500 // Código de status HTTP ou 500 como padrão
  };

  return (
    <div className="mt-5">
      {/* Alert do Bootstrap para exibição do erro */}
      <Alert variant="danger" className="text-center">
        {/* Título principal do erro */}
        <h1>{errorDetails.title}</h1>
        
        {/* Mensagem descritiva do erro */}
        <p className="h4 mt-3">{errorDetails.message}</p>
        
        {/* Código do erro para diagnóstico */}
        <p className="text-muted mt-2">Código do erro: {errorDetails.code}</p>
        
        {/* Grupo de botões para ações de recuperação */}
        <div className="mt-4">
          {/* Botão para voltar à página inicial */}
          <Button 
            variant="primary" 
            onClick={() => navigate('/')} // Navega para a raiz
            className="me-2"
          >
            Página Inicial
          </Button>
          
          {/* Botão para voltar à página anterior */}
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)} // Volta no histórico
          >
            Voltar
          </Button>
        </div>
      </Alert>
    </div>
  );
}