import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MarketChart from './components/MarketChart';
import PlayerWallet from './components/PlayerWallet';
import Leaderboard from './components/Leaderboard';
import NewsTicker from './components/NewsTicker';
import { SocketContext } from './contexts/SocketContext';
import { PlayerContext } from './contexts/PlayerContext';

const SOCKET_URL = 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar ao socket quando o app iniciar
    const newSocket = io(SOCKET_URL);
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado ao servidor');
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado do servidor');
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Verificar se há jogador salvo no localStorage
    const savedPlayer = localStorage.getItem('cryptoRealPlayer');
    if (savedPlayer) {
      try {
        const playerData = JSON.parse(savedPlayer);
        setPlayer(playerData);
        setCurrentView('dashboard');
      } catch (error) {
        console.error('Erro ao carregar jogador:', error);
        localStorage.removeItem('cryptoRealPlayer');
      }
    }
  }, []);

  const handlePlayerLogin = (playerData) => {
    setPlayer(playerData);
    localStorage.setItem('cryptoRealPlayer', JSON.stringify(playerData));
    setCurrentView('dashboard');
    
    // Conectar jogador ao socket
    if (socket) {
      socket.emit('playerJoin', playerData);
    }
  };

  const handleLogout = () => {
    setPlayer(null);
    localStorage.removeItem('cryptoRealPlayer');
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handlePlayerLogin} />;
      case 'dashboard':
        return (
          <Dashboard
            player={player}
            onLogout={handleLogout}
            onViewChange={setCurrentView}
          />
        );
      default:
        return <Login onLogin={handlePlayerLogin} />;
    }
  };

  if (!socket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-blue mx-auto mb-4"></div>
          <p className="text-crypto-gray">Conectando ao servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <SocketContext.Provider value={socket}>
      <PlayerContext.Provider value={{ player, setPlayer }}>
        <div className="min-h-screen bg-crypto-darker">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
          
          {/* Indicador de conexão */}
          <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
            isConnected ? 'bg-crypto-green text-white' : 'bg-crypto-red text-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-white' : 'bg-white animate-pulse'
            }`}></div>
            <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>
      </PlayerContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
