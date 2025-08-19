import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Coins, History, Trophy } from 'lucide-react';
import { SocketContext } from '../contexts/SocketContext';
import { PlayerContext } from '../contexts/PlayerContext';

const PlayerWallet = ({ player }) => {
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPrice, setCurrentPrice] = useState(1.0);
  const [tradeHistory, setTradeHistory] = useState([]);
  
  const socket = useContext(SocketContext);
  const { setPlayer: updatePlayer } = useContext(PlayerContext);

  useEffect(() => {
    if (!socket) return;

    // Receber atualizações de preço
    socket.on('priceUpdated', (data) => {
      setCurrentPrice(data.price);
    });

    // Receber confirmações de trade
    socket.on('tradeExecuted', (data) => {
      if (data.type === 'buy') {
        setMessage(`✅ Compra de ${data.amount} $REAL executada com sucesso!`);
      } else {
        setMessage(`✅ Venda de ${data.amount} $REAL executada com sucesso!`);
      }
      
      // Atualizar dados do jogador
      updatePlayer(prev => ({
        ...prev,
        balanceBRL: data.newBalance,
        balanceREAL: data.newREAL
      }));
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => setMessage(''), 5000);
      
      // Recarregar histórico
      loadTradeHistory();
    });

    // Receber erros
    socket.on('error', (error) => {
      setMessage(`❌ Erro: ${error}`);
      setTimeout(() => setMessage(''), 5000);
    });

    return () => {
      socket.off('priceUpdated');
      socket.off('tradeExecuted');
      socket.off('error');
    };
  }, [socket, updatePlayer]);

  useEffect(() => {
    if (player?.name) {
      loadTradeHistory();
    }
  }, [player]);

  const loadTradeHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/player/${player.name}/history`);
      if (response.ok) {
        const data = await response.json();
        setTradeHistory(data.history || []);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleTrade = async () => {
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      setMessage('❌ Por favor, insira uma quantidade válida');
      return;
    }

    const amount = parseFloat(tradeAmount);
    
    if (tradeType === 'buy') {
      const cost = amount * currentPrice;
      if (player.balanceBRL < cost) {
        setMessage('❌ Saldo BRL insuficiente para esta compra');
        return;
      }
    } else {
      if (player.balanceREAL < amount) {
        setMessage('❌ Saldo $REAL insuficiente para esta venda');
        return;
      }
    }

    setIsLoading(true);
    setMessage('');

    try {
      socket.emit(tradeType === 'buy' ? 'buyREAL' : 'sellREAL', { amount });
    } catch (error) {
      setMessage('❌ Erro ao executar trade');
      setIsLoading(false);
    }
  };

  const calculateTotalValue = () => {
    return player.balanceBRL + (player.balanceREAL * currentPrice);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatREAL = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Resumo da carteira */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Saldo BRL */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="w-6 h-6 text-crypto-green" />
            <h3 className="text-lg font-semibold text-crypto-gray">Saldo BRL</h3>
          </div>
          <div className="text-2xl font-bold text-crypto-green">
            {formatCurrency(player?.balanceBRL || 0)}
          </div>
        </motion.div>

        {/* Saldo $REAL */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Coins className="w-6 h-6 text-crypto-blue" />
            <h3 className="text-lg font-semibold text-crypto-gray">Saldo $REAL</h3>
          </div>
          <div className="text-2xl font-bold text-crypto-blue">
            {formatREAL(player?.balanceREAL || 0)}
          </div>
        </motion.div>

        {/* Patrimônio Total */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Wallet className="w-6 h-6 text-white" />
            <h3 className="text-lg font-semibold text-crypto-gray">Patrimônio</h3>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(calculateTotalValue())}
          </div>
        </motion.div>

        {/* Preço Atual */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-6 h-6 text-crypto-green" />
            <h3 className="text-lg font-semibold text-crypto-gray">Preço $REAL</h3>
          </div>
          <div className="text-2xl font-bold text-crypto-green">
            {formatCurrency(currentPrice)}
          </div>
        </motion.div>
      </div>

      {/* Painel de Trading */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Trading</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compra */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-crypto-green" />
              <h3 className="text-lg font-semibold text-crypto-green">Comprar $REAL</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-crypto-gray mb-2">
                Quantidade $REAL
              </label>
              <input
                type="number"
                value={tradeType === 'buy' ? tradeAmount : ''}
                onChange={(e) => {
                  if (tradeType === 'buy') {
                    setTradeAmount(e.target.value);
                  }
                }}
                className="input-field w-full"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                disabled={tradeType !== 'buy'}
              />
            </div>
            
            <div className="text-sm text-crypto-gray">
              Custo: {tradeAmount && tradeType === 'buy' ? formatCurrency(parseFloat(tradeAmount) * currentPrice) : 'R$ 0,00'}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTradeType('buy');
                setTradeAmount('');
              }}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                tradeType === 'buy'
                  ? 'bg-crypto-green text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              disabled={tradeType === 'buy'}
            >
              Selecionar Compra
            </motion.button>
          </div>

          {/* Venda */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-crypto-red" />
              <h3 className="text-lg font-semibold text-crypto-red">Vender $REAL</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-crypto-gray mb-2">
                Quantidade $REAL
              </label>
              <input
                type="number"
                value={tradeType === 'sell' ? tradeAmount : ''}
                onChange={(e) => {
                  if (tradeType === 'sell') {
                    setTradeAmount(e.target.value);
                  }
                }}
                className="input-field w-full"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                max={player?.balanceREAL || 0}
                disabled={tradeType !== 'sell'}
              />
            </div>
            
            <div className="text-sm text-crypto-gray">
              Receita: {tradeAmount && tradeType === 'sell' ? formatCurrency(parseFloat(tradeAmount) * currentPrice) : 'R$ 0,00'}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTradeType('sell');
                setTradeAmount('');
              }}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                tradeType === 'sell'
                  ? 'bg-crypto-red text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              disabled={tradeType === 'sell'}
            >
              Selecionar Venda
            </motion.button>
          </div>
        </div>

        {/* Botão de execução */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrade}
            disabled={isLoading || !tradeAmount}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors duration-200 ${
              isLoading || !tradeAmount
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : tradeType === 'buy'
                ? 'bg-crypto-green hover:bg-green-600 text-white'
                : 'bg-crypto-red hover:bg-red-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Executando...</span>
              </div>
            ) : (
              `${tradeType === 'buy' ? 'Comprar' : 'Vender'} ${tradeAmount || '0.00'} $REAL`
            )}
          </motion.button>
        </div>

        {/* Mensagens */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg text-center font-medium"
          >
            {message}
          </motion.div>
        )}
      </div>

      {/* Histórico de Trades */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Histórico de Trades</h2>
          <History className="w-5 h-5 text-crypto-gray" />
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tradeHistory.length === 0 ? (
            <div className="text-center text-crypto-gray py-8">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum trade realizado ainda</p>
              <p className="text-sm">Faça seu primeiro trade para começar!</p>
            </div>
          ) : (
            tradeHistory.map((trade, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  trade.type === 'buy'
                    ? 'border-crypto-green/30 bg-crypto-green/10'
                    : 'border-crypto-red/30 bg-crypto-red/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {trade.type === 'buy' ? (
                    <TrendingUp className="w-5 h-5 text-crypto-green" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-crypto-red" />
                  )}
                  <div>
                    <div className={`font-semibold ${
                      trade.type === 'buy' ? 'text-crypto-green' : 'text-crypto-red'
                    }`}>
                      {trade.type === 'buy' ? 'Compra' : 'Venda'}
                    </div>
                    <div className="text-sm text-crypto-gray">
                      {new Date(trade.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {formatREAL(trade.amount)} $REAL
                  </div>
                  <div className="text-sm text-crypto-gray">
                    {formatCurrency(trade.price)} cada
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerWallet;
