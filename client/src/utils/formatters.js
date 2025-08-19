// Formatação de moeda brasileira
export const formatCurrency = (value, currency = 'BRL') => {
  if (typeof value !== 'number') return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Formatação de números
export const formatNumber = (value, decimals = 0) => {
  if (typeof value !== 'number') return '0';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

// Formatação de porcentagem
export const formatPercentage = (value, decimals = 2) => {
  if (typeof value !== 'number') return '0%';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

// Formatação de timestamp
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays} dias atrás`;
  
  return date.toLocaleDateString('pt-BR');
};

// Formatação de tempo relativo
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('pt-BR');
};

// Formatação de volume
export const formatVolume = (value) => {
  if (typeof value !== 'number') return 'R$ 0';
  
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}K`;
  }
  
  return formatCurrency(value);
};

// Formatação de preço da moeda
export const formatREALPrice = (price) => {
  if (typeof price !== 'number') return 'R$ 0,0000';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(price);
};

// Formatação de quantidade de moeda
export const formatREALAmount = (amount) => {
  if (typeof amount !== 'number') return '0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formatação de variação de preço
export const formatPriceChange = (oldPrice, newPrice) => {
  if (typeof oldPrice !== 'number' || typeof newPrice !== 'number') return '0%';
  
  const change = ((newPrice - oldPrice) / oldPrice) * 100;
  return formatPercentage(change);
};

// Formatação de status do mercado
export const formatMarketStatus = (status) => {
  const statusMap = {
    'bull': 'Bull Market',
    'bear': 'Bear Market',
    'stable': 'Estável'
  };
  
  return statusMap[status] || 'Desconhecido';
};

// Formatação de volatilidade
export const formatVolatility = (volatility) => {
  if (typeof volatility !== 'number') return '0%';
  
  return `${(volatility * 100).toFixed(2)}%`;
};
