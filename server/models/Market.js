const mongoose = require('mongoose');

const pricePointSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const marketEventSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  impact: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const marketSchema = new mongoose.Schema({
  currentPrice: {
    type: Number,
    default: 1.0,
    min: 0.01
  },
  priceHistory: [pricePointSchema],
  totalVolume: {
    type: Number,
    default: 0
  },
  dailyVolume: {
    type: Number,
    default: 0
  },
  marketCap: {
    type: Number,
    default: 0
  },
  totalSupply: {
    type: Number,
    default: 1000000000 // 1 bilhão de $REAL
  },
  circulatingSupply: {
    type: Number,
    default: 0
  },
  lastEvents: [marketEventSchema],
  marketStatus: {
    type: String,
    enum: ['bull', 'bear', 'stable'],
    default: 'stable'
  },
  volatilityIndex: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual para calcular variação percentual
marketSchema.virtual('priceChange24h').get(function() {
  if (this.priceHistory.length < 2) return 0;
  
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const currentPrice = this.currentPrice;
  const pastPrice = this.priceHistory.find(p => p.timestamp >= yesterday)?.price || currentPrice;
  
  return ((currentPrice - pastPrice) / pastPrice) * 100;
});

// Método para adicionar ponto de preço
marketSchema.methods.addPricePoint = function(price) {
  this.priceHistory.push({
    timestamp: new Date(),
    price
  });
  
  // Manter apenas últimas 1000 entradas
  if (this.priceHistory.length > 1000) {
    this.priceHistory = this.priceHistory.slice(-1000);
  }
  
  this.currentPrice = price;
};

// Método para adicionar evento de mercado
marketSchema.methods.addMarketEvent = function(message, impact) {
  this.lastEvents.push({
    message,
    impact,
    timestamp: new Date()
  });
  
  // Manter apenas últimos 50 eventos
  if (this.lastEvents.length > 50) {
    this.lastEvents = this.lastEvents.slice(-50);
  }
};

// Método para calcular volatilidade
marketSchema.methods.calculateVolatility = function() {
  if (this.priceHistory.length < 2) return 0;
  
  const prices = this.priceHistory.slice(-20).map(p => p.price);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  
  this.volatilityIndex = Math.sqrt(variance);
  return this.volatilityIndex;
};

// Método para determinar status do mercado
marketSchema.methods.updateMarketStatus = function() {
  const change24h = this.priceChange24h;
  
  if (change24h > 5) {
    this.marketStatus = 'bull';
  } else if (change24h < -5) {
    this.marketStatus = 'bear';
  } else {
    this.marketStatus = 'stable';
  }
};

module.exports = mongoose.model('Market', marketSchema);
