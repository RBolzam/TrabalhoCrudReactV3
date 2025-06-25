import { Outlet, Link } from 'react-router-dom';

// Componente principal de layout da aplicação
export default function Layout() {
  return (
    <div>
      {/* Barra de navegação superior */}
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        {/* Logo/Marca da aplicação com link para página inicial */}
        <Link className="navbar-brand" to="/">Minhas Tarefas</Link>
        
        {/* Link para página de gerenciamento da conta */}
        <Link className="btn btn-outline-info me-2" to="/account">Minha Conta</Link>
        
        {/* Container vazio para alinhamento futuro */}
        <div className="ms-auto">
          {/* Espaço reservado para itens alinhados à direita */}
        </div>
      </nav>
      
      {/* Área principal de conteúdo */}
      <main className="container py-4">
        {/* Componente Outlet do React Router para renderizar conteúdo das rotas */}
        <Outlet />
      </main>
    </div>
  );
}

/* 
 * Componente de limite de erro (error boundary) para o layout
 * Captura e exibe erros ocorridos dentro do componente Layout
 */
export function LayoutErrorBoundary({ error }) {
  return (
    <div className="alert alert-danger mt-4">
      {/* Título de erro */}
      <h5>Algo deu errado ☹️</h5>
      
      {/* Exibe a mensagem de erro em formato pré-formatado */}
      <pre>{error.message}</pre>
    </div>
  );
}