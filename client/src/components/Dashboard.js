import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { LogOut, TrendingUp, Wallet, Trophy, BarChart3, Newspaper } from 'lucide-react';
import { SocketContext } from '../contexts/SocketContext';
import { PlayerContext } from '../contexts/PlayerContext';
import MarketChart from './MarketChart';
import PlayerWallet from './PlayerWallet';
import Leaderboard from './Leaderboard';
import NewsTicker from './NewsTicker';

const Dashboard = ({ player, onLogout, onViewChange }) => {
  const [currentTab, setCurrentTab] = useState('market');
  const [marketData, setMarketData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [news, setNews] = useState([]);
  
  const socket = useContext(SocketContext);
  const { setPlayer } = useContext(PlayerContext);

  useEffect(() => {
    if (!socket) return;

    // Receber dados iniciais do mercado
    socket.on('marketData', (data) => {
      setMarketData(data);
    });

    // Receber atualizações de preço
    socket.on('priceUpdated', (data) => {
      setMarketData(prev => ({
        ...prev,
        currentPrice: data.price,
        history: [...(prev?.history || []), {
          timestamp: data.timestamp,
          price: data.price
        }].slice(-100)
      }));
    });

    // Receber atualizações do leaderboard
    socket.on('leaderboardUpdated', (data) => {
      setLeaderboard(data);
    });

    // Receber eventos de mercado
    socket.on('marketEvent', (data) => {
      setNews(prev => [data, ...prev].slice(0, 10));
    });

    // Receber confirmações de trade
    socket.on('tradeExecuted', (data) => {
      // Atualizar dados do jogador se for o próprio
      if (data.playerId === player?.name) {
        setPlayer(prev => ({
          ...prev,
          balanceBRL: data.newBalance,
          balanceREAL: data.newREAL
        }));
      }
    });

    // Carregar dados iniciais
    fetchInitialData();

    return () => {
      socket.off('marketData');
      socket.off('priceUpdated');
      socket.off('leaderboardUpdated');
      socket.off('marketEvent');
      socket.off('tradeExecuted');
    };
  }, [socket, player]);

  const fetchInitialData = async () => {
    try {
      // Carregar dados do mercado
      const marketResponse = await fetch('http://localhost:5000/api/market/current');
      if (marketResponse.ok) {
        const marketData = await marketResponse.json();
        setMarketData(marketData);
      }

      // Carregar leaderboard
      const leaderboardResponse = await fetch('http://localhost:5000/api/player/leaderboard');
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData.players);
      }

      // Carregar eventos recentes
      const eventsResponse = await fetch('http://localhost:5000/api/market/events');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setNews(eventsData.events);
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const tabs = [
    { id: 'market', label: 'Mercado', icon: TrendingUp, color: 'crypto-blue' },
    { id: 'wallet', label: 'Carteira', icon: Wallet, color: 'crypto-green' },
    { id: 'leaderboard', label: 'Ranking', icon: Trophy, color: 'crypto-green' },
    { id: 'news', label: 'Notícias', icon: Newspaper, color: 'crypto-blue' }
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'market':
        return <MarketChart marketData={marketData} />;
      case 'wallet':
        return <PlayerWallet player={player} />;
      case 'leaderboard':
        return <Leaderboard leaderboard={leaderboard} />;
      case 'news':
        return <NewsTicker news={news} />;
      default:
        return <MarketChart marketData={marketData} />;
    }
  };

  return (
    <div className="min-h-screen bg-crypto-darker">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-crypto-dark border-b border-gray-700 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-crypto-blue to-crypto-green rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Crypto Real Simulator</h1>
              <p className="text-crypto-gray text-sm">Bem-vindo, {player?.name}!</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-crypto-red hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Navegação por abas */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-crypto-dark border-b border-gray-700 px-6"
      >
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? `bg-${tab.color} text-white`
                    : 'text-crypto-gray hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Conteúdo principal */}
      <main className="p-6">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
