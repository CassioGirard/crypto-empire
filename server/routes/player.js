const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET /api/player/leaderboard - Obter ranking global
router.get('/leaderboard', async (req, res) => {
  try {
    const players = await Player.find()
      .select('name balanceBRL balanceREAL totalTrades totalProfit lastActive')
      .sort({ totalProfit: -1 })
      .limit(20);
    
    res.json({ players });
  } catch (error) {
    console.error('Erro ao obter leaderboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/player/:name - Obter dados de um jogador específico
router.get('/:name', async (req, res) => {
  try {
    const player = await Player.findOne({ name: req.params.name });
    
    if (!player) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    
    res.json({
      name: player.name,
      balanceBRL: player.balanceBRL,
      balanceREAL: player.balanceREAL,
      totalTrades: player.totalTrades,
      totalProfit: player.totalProfit,
      achievements: player.achievements,
      lastActive: player.lastActive
    });
  } catch (error) {
    console.error('Erro ao obter jogador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/player/:name/history - Obter histórico de trades de um jogador
router.get('/:name/history', async (req, res) => {
  try {
    const player = await Player.findOne({ name: req.params.name });
    
    if (!player) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    
    // Retornar últimos 50 trades
    const history = player.tradeHistory
      .slice(-50)
      .map(trade => ({
        type: trade.type,
        amount: trade.amount,
        price: trade.price,
        timestamp: trade.timestamp
      }))
      .reverse();
    
    res.json({ history });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/player/:name/achievements - Obter conquistas de um jogador
router.get('/:name/achievements', async (req, res) => {
  try {
    const player = await Player.findOne({ name: req.params.name });
    
    if (!player) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    
    res.json({ achievements: player.achievements });
  } catch (error) {
    console.error('Erro ao obter conquistas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/player/create - Criar novo jogador
router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres' });
    }
    
    // Verificar se nome já existe
    const existingPlayer = await Player.findOne({ name: name.trim() });
    if (existingPlayer) {
      return res.status(409).json({ error: 'Nome já está em uso' });
    }
    
    const player = new Player({
      name: name.trim(),
      balanceBRL: 10000,
      balanceREAL: 0
    });
    
    await player.save();
    
    res.status(201).json({
      message: 'Jogador criado com sucesso',
      player: {
        name: player.name,
        balanceBRL: player.balanceBRL,
        balanceREAL: player.balanceREAL
      }
    });
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/player/stats/global - Obter estatísticas globais
router.get('/stats/global', async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const totalVolume = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalBRL: { $sum: '$balanceBRL' },
          totalREAL: { $sum: '$balanceREAL' }
        }
      }
    ]);
    
    const topTrader = await Player.findOne()
      .sort({ totalProfit: -1 })
      .select('name totalProfit');
    
    const stats = {
      totalPlayers,
      totalBRL: totalVolume[0]?.totalBRL || 0,
      totalREAL: totalVolume[0]?.totalREAL || 0,
      topTrader: topTrader ? {
        name: topTrader.name,
        profit: topTrader.totalProfit
      } : null
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas globais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
