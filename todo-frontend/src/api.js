// Importa a biblioteca Axios para fazer requisições HTTP
import axios from 'axios';

// Cria uma instância customizada do Axios com configurações padrão
const api = axios.create({
  baseURL: 'http://localhost:5000', // Define a URL base da API
});

// Adiciona um interceptador de requisições (executado antes de cada chamada HTTP)
api.interceptors.request.use(config => {
  // Recupera o token JWT do armazenamento local do navegador
  const token = localStorage.getItem('token');
  
  // Se existir um token, adiciona ao cabeçalho de autorização
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Formato padrão para tokens Bearer
  }
  
  // Retorna a configuração modificada da requisição
  return config;
});

// Exporta a instância configurada do Axios para uso em outros módulos
export default api;