const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  unlockedAt: {
    type: Date,
    default: Date.now
  }
});

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  balanceBRL: {
    type: Number,
    default: 10000,
    min: 0
  },
  balanceREAL: {
    type: Number,
    default: 0,
    min: 0
  },
  tradeHistory: [tradeSchema],
  achievements: [achievementSchema],
  totalTrades: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  bestTrade: {
    type: Number,
    default: 0
  },
  worstTrade: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual para calcular patrimônio total
playerSchema.virtual('totalValue').get(function() {
  return this.balanceBRL + (this.balanceREAL * 1); // Preço atual seria calculado dinamicamente
});

// Middleware para atualizar estatísticas
playerSchema.pre('save', function(next) {
  this.totalTrades = this.tradeHistory.length;
  
  // Calcular lucro total (simplificado)
  if (this.tradeHistory.length > 0) {
    let profit = 0;
    this.tradeHistory.forEach(trade => {
      if (trade.type === 'buy') {
        profit -= trade.amount * trade.price;
      } else {
        profit += trade.amount * trade.price;
      }
    });
    this.totalProfit = profit;
  }
  
  this.lastActive = new Date();
  next();
});

// Método para calcular patrimônio com preço atual
playerSchema.methods.calculateTotalValue = function(currentPrice) {
  return this.balanceBRL + (this.balanceREAL * currentPrice);
};

// Método para adicionar conquista
playerSchema.methods.addAchievement = function(name, description) {
  if (!this.achievements.find(a => a.name === name)) {
    this.achievements.push({ name, description });
    return true;
  }
  return false;
};

module.exports = mongoose.model('Player', playerSchema);
