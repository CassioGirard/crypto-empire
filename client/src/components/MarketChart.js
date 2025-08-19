import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
import { SocketContext } from '../contexts/SocketContext';

const MarketChart = ({ marketData }) => {
  const [currentPrice, setCurrentPrice] = useState(1.0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isPriceUp, setIsPriceUp] = useState(true);
  
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (marketData) {
      setCurrentPrice(marketData.currentPrice || 1.0);
      setPriceHistory(marketData.history || []);
      
      // Calcular variação percentual
      if (marketData.history && marketData.history.length > 1) {
        const previousPrice = marketData.history[marketData.history.length - 2]?.price || currentPrice;
        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
        setPriceChange(change);
        setIsPriceUp(change >= 0);
      }
    }
  }, [marketData]);

  useEffect(() => {
    if (!socket) return;

    socket.on('priceUpdated', (data) => {
      setCurrentPrice(data.price);
      
      // Adicionar novo ponto ao histórico
      setPriceHistory(prev => [...prev, {
        timestamp: data.timestamp,
        price: data.price
      }].slice(-100));
      
      // Calcular variação
      if (priceHistory.length > 0) {
        const previousPrice = priceHistory[priceHistory.length - 1]?.price || data.price;
        const change = ((data.price - previousPrice) / previousPrice) * 100;
        setPriceChange(change);
        setIsPriceUp(change >= 0);
      }
    });

    return () => {
      socket.off('priceUpdated');
    };
  }, [socket, priceHistory]);

  // Formatar dados para o gráfico
  const chartData = priceHistory.map((point, index) => ({
    time: index,
    price: point.price,
    timestamp: new Date(point.timestamp).toLocaleTimeString()
  }));

  // Formatar preço para exibição
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(price);
  };

  // Formatar variação percentual
  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header do mercado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Preço atual */}
        <motion.div
          key={currentPrice}
          initial={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          animate={{ scale: 1, backgroundColor: 'transparent' }}
          transition={{ duration: 0.5 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="w-6 h-6 text-crypto-blue" />
            <h3 className="text-lg font-semibold text-crypto-gray">Preço Atual</h3>
          </div>
          <div className={`text-3xl font-bold ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
            {formatPrice(currentPrice)}
          </div>
          <div className={`text-sm mt-1 ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
            {formatChange(priceChange)}
          </div>
        </motion.div>

        {/* Variação 24h */}
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <BarChart3 className="w-6 h-6 text-crypto-green" />
            <h3 className="text-lg font-semibold text-crypto-gray">Variação 24h</h3>
          </div>
          <div className="text-3xl font-bold text-crypto-green">
            +2.45%
          </div>
          <div className="text-sm text-crypto-gray mt-1">
            +0.0245 BRL
          </div>
        </div>

        {/* Volume */}
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Activity className="w-6 h-6 text-crypto-blue" />
            <h3 className="text-lg font-semibold text-crypto-gray">Volume 24h</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(marketData?.volume || 0)}
          </div>
          <div className="text-sm text-crypto-gray mt-1">
            {marketData?.totalTrades || 0} trades
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Histórico de Preços</h2>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {isPriceUp ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPriceUp ? 'Alta' : 'Baixa'}
              </span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (chartData[value]) {
                    return chartData[value].timestamp;
                  }
                  return '';
                }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
                tickFormatter={(value) => value.toFixed(4)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: 'white'
                }}
                labelFormatter={(value) => `Tempo: ${chartData[value]?.timestamp || ''}`}
                formatter={(value) => [formatPrice(value), 'Preço']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Estatísticas do mercado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Informações do Mercado</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-crypto-gray">Market Cap:</span>
              <span className="text-white font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format((marketData?.currentPrice || 1) * 1000000000)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-gray">Supply Total:</span>
              <span className="text-white font-medium">1.000.000.000 $REAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-gray">Supply Circulante:</span>
              <span className="text-white font-medium">
                {new Intl.NumberFormat('pt-BR').format(marketData?.circulatingSupply || 0)} $REAL
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Status do Mercado</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-crypto-gray">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                marketData?.marketStatus === 'bull' 
                  ? 'bg-crypto-green/20 text-crypto-green' 
                  : marketData?.marketStatus === 'bear'
                  ? 'bg-crypto-red/20 text-crypto-red'
                  : 'bg-crypto-gray/20 text-crypto-gray'
              }`}>
                {marketData?.marketStatus === 'bull' ? 'Bull Market' : 
                 marketData?.marketStatus === 'bear' ? 'Bear Market' : 'Estável'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-gray">Volatilidade:</span>
              <span className="text-white font-medium">
                {((marketData?.volatilityIndex || 0) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-gray">Jogadores Ativos:</span>
              <span className="text-white font-medium">
                {marketData?.activePlayers || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketChart;
