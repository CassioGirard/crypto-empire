const config = {
  // URLs da API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  
  // Configurações do jogo
  GAME: {
    INITIAL_BALANCE: 10000, // Saldo inicial em BRL
    MIN_PRICE: 0.01,        // Preço mínimo da moeda
    ELASTICITY_FACTOR: 0.001, // Fator de elasticidade do preço
    MAX_HISTORY_POINTS: 1000, // Máximo de pontos no histórico
    UPDATE_INTERVAL: 1000,    // Intervalo de atualização em ms
  },
  
  // Configurações da interface
  UI: {
    ANIMATION_DURATION: 300,  // Duração das animações em ms
    TOAST_DURATION: 5000,     // Duração dos toasts em ms
    CHART_HEIGHT: 320,        // Altura dos gráficos
    MAX_LEADERBOARD_ITEMS: 20, // Máximo de itens no ranking
  },
  
  // Configurações de eventos
  EVENTS: {
    MARKET_EVENT_INTERVAL: 120000, // Intervalo para eventos (2-5 min)
    VOLATILITY_INTERVAL: 60000,    // Intervalo para volatilidade (1-3 min)
    MAX_NEWS_ITEMS: 20,           // Máximo de notícias
  }
};

export default config;
