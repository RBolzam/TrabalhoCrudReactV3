const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta';

// Middleware de autenticação para proteger rotas
// Verifica se o token JWT é válido e extrai o userId do payload
module.exports = (req, res, next) => {
  // Função auxiliar para decodificar manualmente o token JWT
  // (Nota: esta função não está sendo usada no fluxo principal)
  function parseJwt(token) {
    try {
      // Decodifica a parte do payload (base64) e converte para JSON
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }

  // Obtém o cabeçalho de autorização da requisição
  const header = req.headers.authorization;
  
  // Verifica se o token foi fornecido
  if (!header) return res.status(401).json({ error: 'Token não fornecido' });

  // Divide o cabeçalho no formato "Bearer <token>"
  const [, token] = header.split(' '); // Ignora a primeira parte ("Bearer")
  
  try {
    // Verifica e decodifica o token usando a chave secreta:
    // 1. Valida a assinatura
    // 2. Verifica a expiração (se houver)
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Adiciona o ID do usuário ao objeto de requisição
    // para uso nas rotas subsequentes
    req.userId = payload.userId;
    
    // Passa o controle para o próximo middleware/controller
    next();
  } catch (error) {
    // Captura erros: token inválido, expirado ou com formato incorreto
    res.status(401).json({ error: 'Token inválido' });
  }
};