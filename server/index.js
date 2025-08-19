const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Importar configuração do banco
const connectDB = require('./config/database');

// Conectar ao MongoDB
connectDB();

// Importar modelos
const Player = require('./models/Player');
const Market = require('./models/Market');

// Importar rotas
const marketRoutes = require('./routes/market');
const playerRoutes = require('./routes/player');

// Usar rotas
app.use('/api/market', marketRoutes);
app.use('/api/player', playerRoutes);

// Variáveis globais do mercado
let currentPrice = 1.0; // Preço inicial: 1 BRL
let marketVolume = 0;
let priceHistory = [{ timestamp: Date.now(), price: currentPrice }];
let activePlayers = new Map();

// Sistema de eventos de mercado
const marketEvents = [
  { message: "Hacker rouba exchange!", impact: -0.20, probability: 0.05 },
  { message: "Nova parceria anunciada!", impact: 0.15, probability: 0.08 },
  { message: "Regulamentação aprovada!", impact: 0.10, probability: 0.12 },
  { message: "FUD no mercado!", impact: -0.12, probability: 0.10 },
  { message: "Influencer recomenda $REAL!", impact: 0.08, probability: 0.15 },
  { message: "Crash de mercado!", impact: -0.25, probability: 0.03 },
  { message: "Bull run iniciado!", impact: 0.20, probability: 0.04 }
];

// Função para calcular novo preço baseado em oferta/demanda
function calculateNewPrice(quantity, isBuy) {
  const factorElasticidade = 0.001;
  const priceChange = (isBuy ? quantity : -quantity) * factorElasticidade;
  let newPrice = currentPrice + priceChange;
  
  // Preço mínimo de 0.01 BRL
  newPrice = Math.max(0.01, newPrice);
  
  return newPrice;
}

// Função para aplicar evento de mercado
function applyMarketEvent() {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const event of marketEvents) {
    cumulativeProbability += event.probability;
    if (random <= cumulativeProbability) {
      const newPrice = currentPrice * (1 + event.impact);
      updatePrice(newPrice, `Evento: ${event.message}`);
      break;
    }
  }
}

// Função para atualizar preço
function updatePrice(newPrice, reason = '') {
  currentPrice = newPrice;
  priceHistory.push({
    timestamp: Date.now(),
    price: currentPrice
  });
  
  // Manter apenas últimas 1000 entradas
  if (priceHistory.length > 1000) {
    priceHistory = priceHistory.slice(-1000);
  }
  
  // Salvar no banco
  Market.findOneAndUpdate(
    {},
    { currentPrice, priceHistory: priceHistory.slice(-100) },
    { upsert: true, new: true }
  );
  
  // Emitir para todos os clientes
  io.emit('priceUpdated', {
    price: currentPrice,
    reason,
    timestamp: Date.now()
  });
  
  console.log(`Preço atualizado: ${currentPrice} BRL - ${reason}`);
}

// Socket.io events
io.on('connection', (socket) => {
  console.log('Novo jogador conectado:', socket.id);
  
  socket.on('playerJoin', async (playerData) => {
    try {
      let player = await Player.findOne({ name: playerData.name });
      
      if (!player) {
        player = new Player({
          name: playerData.name,
          balanceBRL: 10000, // Saldo inicial: 10k BRL
          balanceREAL: 0
        });
        await player.save();
      }
      
      activePlayers.set(socket.id, player);
      
      // Enviar dados iniciais
      socket.emit('playerData', player);
      socket.emit('marketData', {
        currentPrice,
        volume: marketVolume,
        history: priceHistory.slice(-100)
      });
      
      // Atualizar ranking
      updateLeaderboard();
      
    } catch (error) {
      console.error('Erro ao conectar jogador:', error);
      socket.emit('error', 'Erro ao conectar jogador');
    }
  });
  
  socket.on('buyREAL', async (data) => {
    try {
      const player = activePlayers.get(socket.id);
      if (!player) return;
      
      const { amount } = data;
      const cost = amount * currentPrice;
      
      if (player.balanceBRL < cost) {
        socket.emit('error', 'Saldo insuficiente');
        return;
      }
      
      // Executar compra
      player.balanceBRL -= cost;
      player.balanceREAL += amount;
      player.tradeHistory.push({
        type: 'buy',
        amount,
        price: currentPrice,
        timestamp: Date.now()
      });
      
      await player.save();
      
      // Atualizar preço
      const newPrice = calculateNewPrice(amount, true);
      updatePrice(newPrice, `Compra de ${amount} $REAL`);
      
      // Atualizar volume
      marketVolume += cost;
      
      // Emitir confirmação
      socket.emit('tradeExecuted', {
        type: 'buy',
        amount,
        price: currentPrice,
        newBalance: player.balanceBRL,
        newREAL: player.balanceREAL
      });
      
      // Notificar outros jogadores
      socket.broadcast.emit('tradeExecuted', {
        type: 'buy',
        amount,
        price: currentPrice
      });
      
      updateLeaderboard();
      
    } catch (error) {
      console.error('Erro na compra:', error);
      socket.emit('error', 'Erro ao executar compra');
    }
  });
  
  socket.on('sellREAL', async (data) => {
    try {
      const player = activePlayers.get(socket.id);
      if (!player) return;
      
      const { amount } = data;
      
      if (player.balanceREAL < amount) {
        socket.emit('error', 'Saldo $REAL insuficiente');
        return;
      }
      
      const revenue = amount * currentPrice;
      
      // Executar venda
      player.balanceBRL += revenue;
      player.balanceREAL -= amount;
      player.tradeHistory.push({
        type: 'sell',
        amount,
        price: currentPrice,
        timestamp: Date.now()
      });
      
      await player.save();
      
      // Atualizar preço
      const newPrice = calculateNewPrice(amount, false);
      updatePrice(newPrice, `Venda de ${amount} $REAL`);
      
      // Atualizar volume
      marketVolume += revenue;
      
      // Emitir confirmação
      socket.emit('tradeExecuted', {
        type: 'sell',
        amount,
        price: currentPrice,
        newBalance: player.balanceBRL,
        newREAL: player.balanceREAL
      });
      
      // Notificar outros jogadores
      socket.broadcast.emit('tradeExecuted', {
        type: 'sell',
        amount,
        price: currentPrice
      });
      
      updateLeaderboard();
      
    } catch (error) {
      console.error('Erro na venda:', error);
      socket.emit('error', 'Erro ao executar venda');
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Jogador desconectado:', socket.id);
    activePlayers.delete(socket.id);
  });
});

// Função para atualizar leaderboard
async function updateLeaderboard() {
  try {
    const players = await Player.find().sort({ totalValue: -1 }).limit(10);
    io.emit('leaderboardUpdated', players);
  } catch (error) {
    console.error('Erro ao atualizar leaderboard:', error);
  }
}

// Eventos de mercado automáticos (a cada 2-5 minutos)
setInterval(() => {
  if (Math.random() < 0.3) { // 30% de chance a cada intervalo
    applyMarketEvent();
  }
}, Math.random() * 180000 + 120000); // 2-5 minutos

// Eventos de volatilidade aleatória (a cada 1-3 minutos)
setInterval(() => {
  const volatility = (Math.random() - 0.5) * 0.06; // ±3%
  const newPrice = currentPrice * (1 + volatility);
  updatePrice(newPrice, 'Volatilidade de mercado');
}, Math.random() * 120000 + 60000); // 1-3 minutos

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Crypto Real Simulator iniciado!');
});
