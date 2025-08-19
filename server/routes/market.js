const express = require('express');
const router = express.Router();
const Market = require('../models/Market');

// GET /api/market/current - Obter dados atuais do mercado
router.get('/current', async (req, res) => {
  try {
    let market = await Market.findOne();
    
    if (!market) {
      market = new Market({
        currentPrice: 1.0,
        priceHistory: [{ timestamp: new Date(), price: 1.0 }]
      });
      await market.save();
    }
    
    res.json({
      currentPrice: market.currentPrice,
      priceChange24h: market.priceChange24h,
      totalVolume: market.totalVolume,
      dailyVolume: market.dailyVolume,
      marketCap: market.marketCap,
      marketStatus: market.marketStatus,
      volatilityIndex: market.volatilityIndex
    });
  } catch (error) {
    console.error('Erro ao obter dados do mercado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/market/history - Obter histórico de preços
router.get('/history', async (req, res) => {
  try {
    const market = await Market.findOne();
    
    if (!market) {
      return res.json({ history: [] });
    }
    
    // Retornar últimas 100 entradas do histórico
    const history = market.priceHistory.slice(-100).map(point => ({
      timestamp: point.timestamp,
      price: point.price
    }));
    
    res.json({ history });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/market/events - Obter eventos recentes do mercado
router.get('/events', async (req, res) => {
  try {
    const market = await Market.findOne();
    
    if (!market) {
      return res.json({ events: [] });
    }
    
    // Retornar últimos 20 eventos
    const events = market.lastEvents.slice(-20).map(event => ({
      message: event.message,
      impact: event.impact,
      timestamp: event.timestamp
    }));
    
    res.json({ events });
  } catch (error) {
    console.error('Erro ao obter eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/market/stats - Obter estatísticas do mercado
router.get('/stats', async (req, res) => {
  try {
    const market = await Market.findOne();
    
    if (!market) {
      return res.json({
        totalSupply: 1000000000,
        circulatingSupply: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0
      });
    }
    
    const stats = {
      totalSupply: market.totalSupply,
      circulatingSupply: market.circulatingSupply,
      marketCap: market.currentPrice * market.totalSupply,
      volume24h: market.dailyVolume,
      priceChange24h: market.priceChange24h,
      marketStatus: market.marketStatus,
      volatilityIndex: market.volatilityIndex
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
