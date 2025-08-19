import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, AlertTriangle, TrendingUp, TrendingDown, Zap, Clock, Star } from 'lucide-react';
import { SocketContext } from '../contexts/SocketContext';

const NewsTicker = ({ news }) => {
  const [currentNews, setCurrentNews] = useState([]);
  const [highlightedNews, setHighlightedNews] = useState(null);
  
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (news && news.length > 0) {
      setCurrentNews(news);
    }
  }, [news]);

  useEffect(() => {
    if (!socket) return;

    // Receber novos eventos de mercado
    socket.on('priceUpdated', (data) => {
      if (data.reason && data.reason.includes('Evento:')) {
        const newEvent = {
          id: Date.now(),
          message: data.reason.replace('Evento: ', ''),
          impact: data.price > 1 ? 'positive' : 'negative',
          timestamp: data.timestamp,
          isNew: true
        };
        
        setCurrentNews(prev => [newEvent, ...prev].slice(0, 20));
        
        // Destacar notícia importante
        if (Math.abs(data.price - 1) > 0.1) {
          setHighlightedNews(newEvent);
          setTimeout(() => setHighlightedNews(null), 8000);
        }
      }
    });

    return () => {
      socket.off('priceUpdated');
    };
  }, [socket]);

  const getImpactIcon = (impact) => {
    if (typeof impact === 'string') {
      return impact === 'positive' ? (
        <TrendingUp className="w-5 h-5 text-crypto-green" />
      ) : (
        <TrendingDown className="w-5 h-5 text-crypto-red" />
      );
    }
    
    // Se impact for numérico (impacto no preço)
    return impact > 0 ? (
      <TrendingUp className="w-5 h-5 text-crypto-green" />
    ) : (
      <TrendingDown className="w-5 h-5 text-crypto-red" />
    );
  };

  const getImpactColor = (impact) => {
    if (typeof impact === 'string') {
      return impact === 'positive' ? 'text-crypto-green' : 'text-crypto-red';
    }
    
    return impact > 0 ? 'text-crypto-green' : 'text-crypto-red';
  };

  const getImpactBackground = (impact) => {
    if (typeof impact === 'string') {
      return impact === 'positive' ? 'bg-crypto-green/10 border-crypto-green/30' : 'bg-crypto-red/10 border-crypto-red/30';
    }
    
    return impact > 0 ? 'bg-crypto-green/10 border-crypto-green/30' : 'bg-crypto-red/10 border-crypto-red/30';
  };

  const formatTimestamp = (timestamp) => {
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

  const getNewsPriority = (newsItem) => {
    if (newsItem.isNew) return 'high';
    if (Math.abs(newsItem.impact || 0) > 0.15) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-yellow-400 bg-yellow-400/5';
      case 'medium':
        return 'border-l-4 border-l-orange-400 bg-orange-400/5';
      default:
        return 'border-l-4 border-l-blue-400 bg-blue-400/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Newspaper className="w-8 h-8 text-crypto-blue" />
          <div>
            <h2 className="text-2xl font-bold text-white">Notícias do Mercado</h2>
            <p className="text-crypto-gray">Eventos e atualizações em tempo real</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 px-3 py-2 bg-crypto-dark rounded-lg border border-gray-700">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-crypto-gray">Live Updates</span>
        </div>
      </div>

      {/* Notícia destacada */}
      <AnimatePresence>
        {highlightedNews && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="card border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-400/10 to-orange-400/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">NOTÍCIA IMPORTANTE</span>
            </div>
            <div className="text-white text-lg font-medium mb-2">
              {highlightedNews.message}
            </div>
            <div className="text-crypto-gray text-sm">
              {formatTimestamp(highlightedNews.timestamp)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de notícias */}
      <div className="space-y-4">
        {currentNews.length === 0 ? (
          <div className="card text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-crypto-gray opacity-50" />
            <p className="text-lg text-crypto-gray">Nenhuma notícia ainda</p>
            <p className="text-sm text-crypto-gray">Eventos de mercado aparecerão aqui</p>
          </div>
        ) : (
          currentNews.map((newsItem, index) => {
            const priority = getNewsPriority(newsItem);
            
            return (
              <motion.div
                key={newsItem.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card ${getPriorityColor(priority)} ${getImpactBackground(newsItem.impact)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getImpactIcon(newsItem.impact)}
                      <div className="flex items-center space-x-2">
                        {newsItem.isNew && (
                          <span className="px-2 py-1 bg-crypto-blue text-white text-xs rounded-full font-medium">
                            NOVO
                          </span>
                        )}
                        <span className={`font-semibold ${getImpactColor(newsItem.impact)}`}>
                          {newsItem.message}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-crypto-gray">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimestamp(newsItem.timestamp)}</span>
                      </div>
                      
                      {newsItem.impact && typeof newsItem.impact === 'number' && (
                        <div className={`flex items-center space-x-1 ${getImpactColor(newsItem.impact)}`}>
                          <span className="font-medium">
                            {newsItem.impact > 0 ? '+' : ''}{(newsItem.impact * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Indicador de prioridade */}
                  <div className="ml-4">
                    <div className={`w-3 h-3 rounded-full ${
                      priority === 'high' ? 'bg-yellow-400' :
                      priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                    }`}></div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Estatísticas das notícias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Newspaper className="w-6 h-6 text-crypto-blue" />
            <h3 className="text-lg font-semibold text-crypto-gray">Total de Notícias</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {currentNews.length}
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-6 h-6 text-crypto-green" />
            <h3 className="text-lg font-semibold text-crypto-gray">Notícias Positivas</h3>
          </div>
          <div className="text-3xl font-bold text-crypto-green">
            {currentNews.filter(n => 
              (typeof n.impact === 'string' && n.impact === 'positive') ||
              (typeof n.impact === 'number' && n.impact > 0)
            ).length}
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingDown className="w-6 h-6 text-crypto-red" />
            <h3 className="text-lg font-semibold text-crypto-gray">Notícias Negativas</h3>
          </div>
          <div className="text-3xl font-bold text-crypto-red">
            {currentNews.filter(n => 
              (typeof n.impact === 'string' && n.impact === 'negative') ||
              (typeof n.impact === 'number' && n.impact < 0)
            ).length}
          </div>
        </div>
      </div>

      {/* Informações sobre o sistema de notícias */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Sobre o Sistema de Notícias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-crypto-gray">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Alta prioridade: Eventos importantes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>Média prioridade: Mudanças significativas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Baixa prioridade: Atualizações normais</span>
            </div>
          </div>
          <div className="space-y-2">
            <p>• Notícias são geradas automaticamente</p>
            <p>• Impacto no preço é calculado em tempo real</p>
            <p>• Eventos importantes são destacados</p>
            <p>• Histórico é mantido para análise</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
