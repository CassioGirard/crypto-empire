// Validação de nome de jogador
export const validatePlayerName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (trimmedName.length > 20) {
    return { isValid: false, error: 'Nome deve ter no máximo 20 caracteres' };
  }

  // Verificar se contém apenas caracteres válidos
  const validNameRegex = /^[a-zA-ZÀ-ÿ0-9\s]+$/;
  if (!validNameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Nome deve conter apenas letras, números e espaços' };
  }

  return { isValid: true, error: null };
};

// Validação de quantidade para trade
export const validateTradeAmount = (amount, type, playerBalance, currentPrice) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    return { isValid: false, error: 'Quantidade deve ser um número positivo' };
  }

  const numAmount = parseFloat(amount);
  
  if (type === 'buy') {
    const cost = numAmount * currentPrice;
    if (cost > playerBalance) {
      return { isValid: false, error: 'Saldo insuficiente para esta compra' };
    }
  } else if (type === 'sell') {
    if (numAmount > playerBalance) {
      return { isValid: false, error: 'Saldo $REAL insuficiente para esta venda' };
    }
  }

  // Verificar se a quantidade é muito pequena
  if (numAmount < 0.01) {
    return { isValid: false, error: 'Quantidade mínima é 0.01 $REAL' };
  }

  // Verificar se a quantidade é muito grande
  if (numAmount > 1000000) {
    return { isValid: false, error: 'Quantidade máxima é 1.000.000 $REAL' };
  }

  return { isValid: true, error: null };
};

// Validação de preço
export const validatePrice = (price) => {
  if (!price || isNaN(price)) {
    return { isValid: false, error: 'Preço deve ser um número válido' };
  }

  if (price < 0.01) {
    return { isValid: false, error: 'Preço mínimo é R$ 0,01' };
  }

  if (price > 1000000) {
    return { isValid: false, error: 'Preço máximo é R$ 1.000.000' };
  }

  return { isValid: true, error: null };
};

// Validação de email (para futuras funcionalidades)
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email deve ter um formato válido' };
  }

  return { isValid: true, error: null };
};

// Validação de senha (para futuras funcionalidades)
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Senha é obrigatória' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Senha deve ter pelo menos 6 caracteres' };
  }

  if (password.length > 50) {
    return { isValid: false, error: 'Senha deve ter no máximo 50 caracteres' };
    }
    
    return { isValid: true, error: null };
};

// Validação de número de telefone (para futuras funcionalidades)
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Telefone é obrigatório' };
  }

  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { isValid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
  }

  return { isValid: true, error: null };
};

// Validação de CPF (para futuras funcionalidades)
export const validateCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') {
    return { isValid: false, error: 'CPF é obrigatório' };
  }

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { isValid: false, error: 'CPF inválido' };
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder < 2 ? 0 : remainder;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder < 2 ? 0 : remainder;

  // Verificar se os dígitos verificadores estão corretos
  if (parseInt(cleanCPF.charAt(9)) !== digit1 || parseInt(cleanCPF.charAt(10)) !== digit2) {
    return { isValid: false, error: 'CPF inválido' };
  }

  return { isValid: true, error: null };
};

// Validação de data (para futuras funcionalidades)
export const validateDate = (date) => {
  if (!date) {
    return { isValid: false, error: 'Data é obrigatória' };
  }

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Data deve ter um formato válido' };
  }

  const today = new Date();
  if (dateObj > today) {
    return { isValid: false, error: 'Data não pode ser no futuro' };
  }

  return { isValid: true, error: null };
};

// Validação de URL (para futuras funcionalidades)
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL é obrigatória' };
  }

  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch {
    return { isValid: false, error: 'URL deve ter um formato válido' };
  }
};
