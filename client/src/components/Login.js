import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, User, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Por favor, digite um nome');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Tentar criar jogador via API
      const response = await fetch('http://localhost:5000/api/player/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.player);
      } else {
        // Se o jogador já existe, usar o nome para login
        if (response.status === 409) {
          // Buscar dados do jogador existente
          const playerResponse = await fetch(`http://localhost:5000/api/player/${playerName.trim()}`);
          if (playerResponse.ok) {
            const playerData = await playerResponse.json();
            onLogin(playerData);
          } else {
            setError('Erro ao carregar jogador existente');
          }
        } else {
          setError(data.error || 'Erro ao criar jogador');
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crypto-darker via-crypto-dark to-crypto-darker p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo e título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-crypto-blue to-crypto-green rounded-full mb-6"
          >
            <TrendingUp className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Crypto Real
          </motion.h1>
          
          <motion.p
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-crypto-gray text-lg"
          >
            Simulador de Mercado
          </motion.p>
        </div>

        {/* Formulário */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-crypto-gray mb-2">
                Nome do Jogador
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-crypto-gray" />
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="input-field w-full pl-10"
                  placeholder="Digite seu nome"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-crypto-red/20 border border-crypto-red/30 text-crypto-red px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Mercado</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Informações do jogo */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-crypto-gray text-sm space-y-2"
        >
          <p>💰 Comece com 10.000 BRL fictícios</p>
          <p>📈 Compre e venda $REAL em tempo real</p>
          <p>🏆 Compita com outros jogadores</p>
          <p>⚡ Preço dinâmico baseado na oferta e demanda</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
