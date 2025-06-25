/**
 * Decodifica o payload de um token JWT (JSON Web Token)
 * 
 * @param {string} token - Token JWT no formato "header.payload.signature"
 * @returns {object} Objeto JavaScript contendo os dados decodificados do payload
 *                   ou um objeto vazio em caso de erro
 * 
 * Funcionamento:
 * 1. Divide o token em 3 partes usando o separador '.' (ponto)
 * 2. Seleciona a segunda parte (payload) - índice 1
 * 3. Decodifica a string Base64 para uma string UTF-8
 * 4. Converte a string JSON resultante em objeto JavaScript
 * 
 * Importante: Esta função apenas decodifica, NÃO VERIFICA a autenticidade do token!
 * A validação da assinatura deve sempre ser feita no servidor.
 */
export function parseJwt(token) {
  try {
    // Passo 1: Divide o token em partes [header, payload, signature]
    // Passo 2: Seleciona o payload (segunda parte - índice 1)
    // Passo 3: Decodifica de Base64 para string
    // Passo 4: Converte a string JSON em objeto JavaScript
    return JSON.parse(atob(token.split('.')[1]));
    
  } catch (error) {
    // Retorna objeto vazio em caso de:
    // - Token malformado (não tem 3 partes)
    // - Decodificação Base64 falhar
    // - JSON inválido
    return {};
  }
}