// Importa as bibliotecas necessárias para roteamento
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importa componentes de layout e tratamento de erros
import Layout, { LayoutErrorBoundary } from './components/Layout';

// Importa componentes relacionados a tarefas
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

// Importa componentes de páginas e tratamento de erros
import ErrorPage from './components/ErrorPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Importa componente de proteção de rotas e página de conta
import RequireAuth from './components/RequireAuth';
import Account from './pages/Account'; // Importa a página de gerenciamento de conta

// Configura o roteador da aplicação com todas as rotas
const router = createBrowserRouter([
  // Rota pública para login
  {
    path: '/login',
    element: <Login />
  },
  
  // Rota pública para registro de novos usuários
  {
    path: '/register',
    element: <Register />
  },
  
  // Rota protegida para gerenciamento da conta do usuário
  {
    path: '/account',
    element: (
      <RequireAuth> {/* Requer autenticação */}
        <Account />
      </RequireAuth>
    ),
    errorElement: <ErrorPage /> // Página de erro específica
  },
  
  // Layout principal que envolve as rotas protegidas
  {
    element: <Layout />, // Componente de layout comum
    errorElement: <LayoutErrorBoundary />, // Tratamento de erros no layout
    children: [ // Rotas filhas que herdam o layout
      // Rota principal (lista de tarefas)
      {
        path: '/',
        element: (
          <RequireAuth> {/* Protege a rota */}
            <TaskList /> {/* Lista de tarefas */}
          </RequireAuth>
        ),
        errorElement: <ErrorPage />
      },
      
      // Rota para criação de nova tarefa
      {
        path: '/new',
        element: (
          <RequireAuth>
            <TaskForm mode="create" /> {/* Formulário em modo criação */}
          </RequireAuth>
        ),
        errorElement: <ErrorPage />
      },
      
      // Rota para edição de tarefa existente
      {
        path: '/edit/:id', // Parâmetro dinâmico: ID da tarefa
        element: (
          <RequireAuth>
            <TaskForm mode="edit" /> {/* Formulário em modo edição */}
          </RequireAuth>
        ),
        errorElement: <ErrorPage />
      }
    ]
  }
]);

// Componente principal da aplicação
export default function App() {
  // Provedor de roteamento que disponibiliza as rotas para toda a aplicação
  return <RouterProvider router={router} />;
}