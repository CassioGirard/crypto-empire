import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, TrendingDown, Crown, Users, BarChart3 } from 'lucide-react';

const Leaderboard = ({ leaderboard }) => {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalVolume: 0,
    topTrader: null
  });

  useEffect(() => {
    loadGlobalStats();
  }, []);

  const loadGlobalStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/player/stats/global');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas globais:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-4 h-4 text-crypto-gray" />;
    }
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/30';
      case 2:
        return 'from-gray-300/20 to-gray-500/20 border-gray-300/30';
      case 3:
        return 'from-amber-600/20 to-amber-800/20 border-amber-600/30';
      default:
        return 'from-crypto-dark to-crypto-dark border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas globais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="w-6 h-6 text-crypto-blue" />
            <h3 className="text-lg font-semibold text-crypto-gray">Total de Jogadores</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatNumber(stats.totalPlayers)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <BarChart3 className="w-6 h-6 text-crypto-green" />
            <h3 className="text-lg font-semibold text-crypto-gray">Volume Total</h3>
          </div>
          <div className="text-3xl font-bold text-crypto-green">
            {formatCurrency(stats.totalBRL)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-crypto-gray">Top Trader</h3>
          </div>
          <div className="text-xl font-bold text-yellow-400">
            {stats.topTrader?.name || 'N/A'}
          </div>
          <div className="text-sm text-crypto-gray">
            {stats.topTrader ? formatCurrency(stats.topTrader.profit) : 'N/A'}
          </div>
        </motion.div>
      </div>

      {/* Ranking principal */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Ranking Global</h2>
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center text-crypto-gray py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum jogador ainda</p>
            <p className="text-sm">Seja o primeiro a fazer trades!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const position = index + 1;
              const isTop3 = position <= 3;
              
              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-xl border-2 ${getRankColor(position)} ${
                    isTop3 ? 'shadow-lg' : ''
                  }`}
                >
                  {/* Posição */}
                  <div className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-crypto-dark border-2 border-gray-700 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{position}</span>
                  </div>

                  {/* Ícone de ranking */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {getRankIcon(position)}
                  </div>

                  <div className="flex items-center justify-between ml-6">
                    {/* Informações do jogador */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-crypto-blue to-crypto-green rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {player.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">
                            {player.name}
                          </div>
                          <div className="text-sm text-crypto-gray">
                            {player.totalTrades || 0} trades • Última atividade: {
                              player.lastActive 
                                ? new Date(player.lastActive).toLocaleDateString('pt-BR')
                                : 'N/A'
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-crypto-gray text-sm">Patrimônio:</span>
                        <span className="font-bold text-white">
                          {formatCurrency(player.balanceBRL + (player.balanceREAL * 1))}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-crypto-gray text-sm">Lucro:</span>
                        <div className={`flex items-center space-x-1 ${
                          (player.totalProfit || 0) >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                        }`}>
                          {(player.totalProfit || 0) >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {formatCurrency(Math.abs(player.totalProfit || 0))}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-crypto-gray text-sm">Saldo:</span>
                        <span className="text-white">
                          {formatCurrency(player.balanceBRL)} + {formatNumber(player.balanceREAL)} $REAL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progresso para top 3 */}
                  {isTop3 && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-crypto-gray">Progresso para próximo ranking:</span>
                        <span className="text-white font-medium">
                          {position === 1 ? '🏆 Líder' : position === 2 ? '🥈 Vice' : '🥉 Terceiro'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            position === 1 ? 'bg-yellow-400' : 
                            position === 2 ? 'bg-gray-300' : 'bg-amber-600'
                          }`}
                          style={{ width: `${100 - (position - 1) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Informações adicionais */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Como funciona o ranking?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-crypto-gray">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>1º lugar: Coroa dourada + destaque especial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="w-4 h-4 text-gray-300" />
              <span>2º lugar: Medalha de prata</span>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="w-4 h-4 text-amber-600" />
              <span>3º lugar: Medalha de bronze</span>
            </div>
          </div>
          <div className="space-y-2">
            <p>• Ranking atualizado em tempo real</p>
            <p>• Baseado no patrimônio total (BRL + $REAL)</p>
            <p>• Jogadores inativos podem perder posições</p>
            <p>• Novos jogadores começam no final da lista</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
