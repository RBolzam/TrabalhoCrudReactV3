// Importa o módulo principal do React
import React from 'react';

// Importa a biblioteca ReactDOM para manipulação do DOM
import ReactDOM from 'react-dom/client';

// Importa o framework CSS Bootstrap para estilização global
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa os ícones do Bootstrap para uso na interface
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importa o componente principal da aplicação
import App from './App';

// Cria uma raiz de renderização no elemento com ID 'root' do HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza a aplicação dentro da raiz criada
root.render(
  // <React.StrictMode> é um wrapper que ativa verificações extras durante o desenvolvimento
  // Ele ajuda a identificar problemas potenciais na aplicação
  <React.StrictMode>
    {/* Componente principal da aplicação */}
    <App />
  </React.StrictMode>
);