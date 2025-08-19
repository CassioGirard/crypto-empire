class CryptoGame {
    constructor() {
        this.balance = 10000;
        this.portfolio = {};
        this.day = 1;
        this.isPaused = false;
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.totalProfit = 0;
        this.totalTrades = 0;
        this.successfulTrades = 0;
        this.achievements = [];
        this.specialEvents = [];
        this.news = [];
        this.riskLevel = 1; // 1-5, afeta volatilidade
        this.marketSentiment = 'neutral'; // bullish, bearish, neutral
        
        // Novas funcionalidades
        this.missions = [];
        this.leaderboard = [];
        this.streak = 0; // Dias consecutivos de lucro
        this.maxStreak = 0;
        this.dailyBonus = 0;
        this.insurance = false;
        this.insuranceCost = 0;
        this.insuranceDays = 0;
        this.tradingFee = 0.001; // 0.1% por trade
        this.portfolioHistory = [];
        this.favoriteCryptos = [];
        this.notifications = [];
        this.soundEnabled = true;
        this.theme = 'light';
        
        this.cryptos = [
            { name: 'Bitcoin', symbol: 'BTC', price: 45000, volatility: 0.15, marketCap: 850000000000, category: 'store-of-value', trend: 'up', lastUpdate: 0 },
            { name: 'Ethereum', symbol: 'ETH', price: 3200, volatility: 0.18, marketCap: 380000000000, category: 'smart-contracts', trend: 'up', lastUpdate: 0 },
            { name: 'Cardano', symbol: 'ADA', price: 1.20, volatility: 0.25, marketCap: 42000000000, category: 'smart-contracts', trend: 'down', lastUpdate: 0 },
            { name: 'Solana', symbol: 'SOL', price: 95, volatility: 0.22, marketCap: 41000000000, category: 'smart-contracts', trend: 'up', lastUpdate: 0 },
            { name: 'Polkadot', symbol: 'DOT', price: 18, volatility: 0.20, marketCap: 18000000000, category: 'interoperability', trend: 'neutral', lastUpdate: 0 },
            { name: 'Chainlink', symbol: 'LINK', price: 25, volatility: 0.23, marketCap: 14000000000, category: 'oracles', trend: 'down', lastUpdate: 0 },
            { name: 'Uniswap', symbol: 'UNI', price: 12, volatility: 0.21, marketCap: 7200000000, category: 'defi', trend: 'up', lastUpdate: 0 },
            { name: 'Aave', symbol: 'AAVE', price: 280, volatility: 0.19, marketCap: 4000000000, category: 'defi', trend: 'neutral', lastUpdate: 0 },
            { name: 'Polygon', symbol: 'MATIC', price: 0.85, volatility: 0.26, marketCap: 8000000000, category: 'scaling', trend: 'up', lastUpdate: 0 },
            { name: 'Avalanche', symbol: 'AVAX', price: 35, volatility: 0.24, marketCap: 12000000000, category: 'smart-contracts', trend: 'down', lastUpdate: 0 },
            // Novas criptomoedas
            { name: 'Dogecoin', symbol: 'DOGE', price: 0.08, volatility: 0.35, marketCap: 12000000000, category: 'meme', trend: 'neutral', lastUpdate: 0 },
            { name: 'Shiba Inu', symbol: 'SHIB', price: 0.00002, volatility: 0.40, marketCap: 8000000000, category: 'meme', trend: 'neutral', lastUpdate: 0 },
            { name: 'Litecoin', symbol: 'LTC', price: 120, volatility: 0.18, marketCap: 8000000000, category: 'store-of-value', trend: 'down', lastUpdate: 0 },
            { name: 'Bitcoin Cash', symbol: 'BCH', price: 280, volatility: 0.25, marketCap: 5000000000, category: 'store-of-value', trend: 'neutral', lastUpdate: 0 },
            { name: 'XRP', symbol: 'XRP', price: 0.75, volatility: 0.20, marketCap: 35000000000, category: 'payments', trend: 'up', lastUpdate: 0 }
        ];
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateUI();
        this.generateNews();
        this.startSpecialEvents();
        this.initializeMissions();
        this.initializeLeaderboard();
        this.loadGameState();
    }

    initializeGame() {
        // Inicializar portfolio vazio
        this.cryptos.forEach(crypto => {
            this.portfolio[crypto.symbol] = {
                amount: 0,
                avgPrice: 0,
                firstBuyDay: 0,
                lastTradeDay: 0,
                totalBought: 0,
                totalSold: 0
            };
        });
        
        // Inicializar conquistas
        this.achievements = [
            { id: 'first-trade', name: 'Primeiro Trade', description: 'Execute sua primeira compra', unlocked: false, reward: 50 },
            { id: 'profit-maker', name: 'Fazedor de Lucros', description: 'Tenha um lucro de $1000', unlocked: false, reward: 100 },
            { id: 'diversifier', name: 'Diversificador', description: 'Possua 5 criptomoedas diferentes', unlocked: false, reward: 150 },
            { id: 'millionaire', name: 'Milionário', description: 'Alcance $1,000,000', unlocked: false, reward: 500 },
            { id: 'day-trader', name: 'Day Trader', description: 'Execute 50 trades', unlocked: false, reward: 200 },
            { id: 'hodler', name: 'HODLer', description: 'Mantenha uma criptomoeda por 30 dias', unlocked: false, reward: 300 },
            // Novas conquistas
            { id: 'streak-master', name: 'Mestre da Sequência', description: 'Mantenha 10 dias consecutivos de lucro', unlocked: false, reward: 400 },
            { id: 'risk-taker', name: 'Tomador de Risco', description: 'Use nível de risco máximo por 5 dias', unlocked: false, reward: 250 },
            { id: 'mission-complete', name: 'Completador de Missões', description: 'Complete 20 missões', unlocked: false, reward: 350 },
            { id: 'trend-follower', name: 'Seguidor de Tendências', description: 'Compre 3 criptomoedas em tendência de alta', unlocked: false, reward: 200 }
        ];
    }

    initializeMissions() {
        this.missions = [
            { id: 'daily-profit', name: 'Lucro Diário', description: 'Ganhe $500 hoje', reward: 100, type: 'daily', progress: 0, target: 500, completed: false },
            { id: 'buy-low', name: 'Compre na Baixa', description: 'Compre uma criptomoeda que caiu 10%', reward: 75, type: 'achievement', progress: 0, target: 1, completed: false },
            { id: 'sell-high', name: 'Venda na Alta', description: 'Venda uma criptomoeda que subiu 15%', reward: 75, type: 'achievement', progress: 0, target: 1, completed: false },
            { id: 'diversify', name: 'Diversifique', description: 'Possua 3 criptomoedas diferentes', reward: 50, type: 'achievement', progress: 0, target: 3, completed: false }
        ];
    }

    initializeLeaderboard() {
        this.leaderboard = [
            { name: 'CryptoKing', balance: 150000, level: 8, totalProfit: 140000 },
            { name: 'BitcoinBaron', balance: 120000, level: 7, totalProfit: 110000 },
            { name: 'EthereumElite', balance: 95000, level: 6, totalProfit: 85000 },
            { name: 'AltcoinAce', balance: 78000, level: 5, totalProfit: 68000 },
            { name: 'DeFiDuke', balance: 65000, level: 5, totalProfit: 55000 }
        ];
    }

    setupEventListeners() {
        document.getElementById('next-day').addEventListener('click', () => this.nextDay());
        document.getElementById('pause').addEventListener('click', () => this.togglePause());
        document.getElementById('buy-btn').addEventListener('click', () => this.buy());
        document.getElementById('sell-btn').addEventListener('click', () => this.sell());
        document.getElementById('risk-increase').addEventListener('click', () => this.changeRisk(1));
        document.getElementById('risk-decrease').addEventListener('click', () => this.changeRisk(-1));
        
        // Novos event listeners
        this.setupNewEventListeners();
        
        // Auto-advance quando não pausado
        setInterval(() => {
            if (!this.isPaused) {
                this.nextDay();
            }
        }, 30000); // 30 segundos por dia
        
        // Header scroll effect
        this.setupHeaderScrollEffect();
    }

    setupNewEventListeners() {
        // Adicionar botões para novas funcionalidades se existirem
        const buyInsuranceBtn = document.getElementById('buy-insurance');
        if (buyInsuranceBtn) {
            buyInsuranceBtn.addEventListener('click', () => this.buyInsurance());
        }

        const toggleSoundBtn = document.getElementById('toggle-sound');
        if (toggleSoundBtn) {
            toggleSoundBtn.addEventListener('click', () => this.toggleSound());
        }

        const toggleThemeBtn = document.getElementById('toggle-theme');
        if (toggleThemeBtn) {
            toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
        }

        const addToFavoritesBtn = document.getElementById('add-favorites');
        if (addToFavoritesBtn) {
            addToFavoritesBtn.addEventListener('click', () => this.toggleFavorites());
        }
    }

    nextDay() {
        if (this.isPaused) return;
        
        this.day++;
        
        // Atualizar sentimento do mercado
        this.updateMarketSentiment();
        
        // Simular mudanças de preço baseadas no sentimento e nível de risco
        this.cryptos.forEach(crypto => {
            const baseChange = (Math.random() - 0.5) * 2 * crypto.volatility;
            const sentimentMultiplier = this.getSentimentMultiplier();
            const riskMultiplier = this.riskLevel * 0.2;
            
            const change = baseChange * sentimentMultiplier * (1 + riskMultiplier);
            const oldPrice = crypto.price;
            crypto.price *= (1 + change);
            crypto.price = Math.max(crypto.price, 0.01); // Preço mínimo
            
            // Atualizar tendência
            if (crypto.price > oldPrice) {
                crypto.trend = 'up';
            } else if (crypto.price < oldPrice) {
                crypto.trend = 'down';
            } else {
                crypto.trend = 'neutral';
            }
            
            crypto.lastUpdate = this.day;
            
            // Verificar HODLer achievement
            if (this.portfolio[crypto.symbol].amount > 0 && this.portfolio[crypto.symbol].firstBuyDay > 0) {
                const daysHeld = this.day - this.portfolio[crypto.symbol].firstBuyDay;
                if (daysHeld >= 30) {
                    this.unlockAchievement('hodler');
                }
            }
        });
        
        // Atualizar portfolio e calcular lucros
        this.updatePortfolio();
        
        // Verificar conquistas
        this.checkAchievements();
        
        // Verificar missões
        this.checkMissions();
        
        // Atualizar streak
        this.updateStreak();
        
        // Aplicar bônus diário
        this.applyDailyBonus();
        
        // Verificar seguro
        this.checkInsurance();
        
        // Salvar histórico do portfolio
        this.savePortfolioHistory();
        
        // Atualizar UI
        this.updateUI();
        
        // Gerar notícias
        this.generateNews();
        
        // Verificar eventos especiais
        this.checkSpecialEvents();
    }

    updateMarketSentiment() {
        const random = Math.random();
        if (random < 0.4) {
            this.marketSentiment = 'neutral';
        } else if (random < 0.7) {
            this.marketSentiment = 'bullish';
        } else {
            this.marketSentiment = 'bearish';
        }
    }

    getSentimentMultiplier() {
        switch (this.marketSentiment) {
            case 'bullish': return 1.2;
            case 'bearish': return 0.8;
            default: return 1.0;
        }
    }

    changeRisk(direction) {
        const newRisk = this.riskLevel + direction;
        if (newRisk >= 1 && newRisk <= 5) {
            this.riskLevel = newRisk;
            this.updateUI();
            this.showNotification(`Nível de risco alterado para ${this.riskLevel}`, 'info');
        }
    }

    buy() {
        const cryptoSelect = document.getElementById('crypto-select');
        const amountInput = document.getElementById('amount');
        
        const selectedCrypto = cryptoSelect.value;
        const amount = parseFloat(amountInput.value);
        
        if (!selectedCrypto || !amount || amount <= 0) {
            this.showNotification('Por favor, selecione uma criptomoeda e insira uma quantidade válida.', 'error');
            return;
        }
        
        const crypto = this.cryptos.find(c => c.symbol === selectedCrypto);
        if (!crypto) return;
        
        const totalCost = amount * crypto.price;
        const fee = totalCost * this.tradingFee;
        const totalWithFee = totalCost + fee;
        
        if (totalWithFee > this.balance) {
            this.showNotification('Saldo insuficiente para esta compra.', 'error');
            return;
        }
        
        // Executar compra
        this.balance -= totalWithFee;
        
        if (this.portfolio[selectedCrypto].amount === 0) {
            this.portfolio[selectedCrypto].avgPrice = crypto.price;
            this.portfolio[selectedCrypto].firstBuyDay = this.day;
        } else {
            const totalAmount = this.portfolio[selectedCrypto].amount + amount;
            const totalValue = (this.portfolio[selectedCrypto].amount * this.portfolio[selectedCrypto].avgPrice) + (amount * crypto.price);
            this.portfolio[selectedCrypto].avgPrice = totalValue / totalAmount;
        }
        
        this.portfolio[selectedCrypto].amount += amount;
        this.portfolio[selectedCrypto].lastTradeDay = this.day;
        this.portfolio[selectedCrypto].totalBought += amount;
        
        this.totalTrades++;
        this.experience += 10;
        
        this.showNotification(`Compra realizada: ${amount} ${selectedCrypto} por $${totalCost.toFixed(2)}`, 'success');
        
        // Verificar conquistas
        this.checkAchievements();
        
        // Atualizar UI
        this.updateUI();
        
        // Limpar formulário
        amountInput.value = '';
        
        // Verificar level up
        this.checkLevelUp();
    }

    sell() {
        const cryptoSelect = document.getElementById('crypto-select');
        const amountInput = document.getElementById('amount');
        
        const selectedCrypto = cryptoSelect.value;
        const amount = parseFloat(amountInput.value);
        
        if (!selectedCrypto || !amount || amount <= 0) {
            this.showNotification('Por favor, selecione uma criptomoeda e insira uma quantidade válida.', 'error');
            return;
        }
        
        const holding = this.portfolio[selectedCrypto];
        if (holding.amount < amount) {
            this.showNotification('Quantidade insuficiente para venda.', 'error');
            return;
        }
        
        const crypto = this.cryptos.find(c => c.symbol === selectedCrypto);
        if (!crypto) return;
        
        const totalValue = amount * crypto.price;
        const fee = totalValue * this.tradingFee;
        const totalAfterFee = totalValue - fee;
        
        // Calcular lucro/prejuízo
        const avgPrice = holding.avgPrice;
        const profit = (crypto.price - avgPrice) * amount;
        
        // Executar venda
        this.balance += totalAfterFee;
        holding.amount -= amount;
        holding.lastTradeDay = this.day;
        holding.totalSold += amount;
        
        if (holding.amount === 0) {
            holding.avgPrice = 0;
        }
        
        this.totalTrades++;
        this.experience += 15;
        
        if (profit > 0) {
            this.successfulTrades++;
            this.showNotification(`Venda realizada: ${amount} ${selectedCrypto} por $${totalValue.toFixed(2)} (Lucro: $${profit.toFixed(2)})`, 'success');
        } else {
            this.showNotification(`Venda realizada: ${amount} ${selectedCrypto} por $${totalValue.toFixed(2)} (Prejuízo: $${Math.abs(profit).toFixed(2)})`, 'info');
        }
        
        // Verificar conquistas
        this.checkAchievements();
        
        // Atualizar UI
        this.updateUI();
        
        // Limpar formulário
        amountInput.value = '';
        
        // Verificar level up
        this.checkLevelUp();
    }

    addExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToNextLevel) {
            this.experience -= this.experienceToNextLevel;
            this.levelUp();
        }
    }

    checkAchievements() {
        // Verificar primeira compra
        if (this.totalTrades === 1) {
            this.unlockAchievement('first-trade');
        }
        
        // Verificar lucro de $1000
        if (this.totalProfit >= 1000 && !this.achievements.find(a => a.id === 'profit-maker').unlocked) {
            this.unlockAchievement('profit-maker');
        }
        
        // Verificar diversificação
        const uniqueCryptos = Object.keys(this.portfolio).filter(symbol => 
            this.portfolio[symbol].amount > 0
        ).length;
        if (uniqueCryptos >= 5 && !this.achievements.find(a => a.id === 'diversifier').unlocked) {
            this.unlockAchievement('diversifier');
        }
        
        // Verificar milionário
        if (this.balance >= 1000000 && !this.achievements.find(a => a.id === 'millionaire').unlocked) {
            this.unlockAchievement('millionaire');
        }
        
        // Verificar day trader
        if (this.totalTrades >= 50 && !this.achievements.find(a => a.id === 'day-trader').unlocked) {
            this.unlockAchievement('day-trader');
        }
        
        // Verificar HODLer
        Object.keys(this.portfolio).forEach(symbol => {
            const holding = this.portfolio[symbol];
            if (holding.amount > 0 && holding.firstBuyDay > 0) {
                const daysHeld = this.day - holding.firstBuyDay;
                if (daysHeld >= 30 && !this.achievements.find(a => a.id === 'hodler').unlocked) {
                    this.unlockAchievement('hodler');
                }
            }
        });
        
        // Verificar streak master
        if (this.streak >= 10 && !this.achievements.find(a => a.id === 'streak-master').unlocked) {
            this.unlockAchievement('streak-master');
        }
        
        // Verificar risk taker
        if (this.riskLevel === 5 && !this.achievements.find(a => a.id === 'risk-taker').unlocked) {
            this.unlockAchievement('risk-taker');
        }
        
        // Verificar mission complete
        const completedMissions = this.missions.filter(m => m.completed).length;
        if (completedMissions >= 20 && !this.achievements.find(a => a.id === 'mission-complete').unlocked) {
            this.unlockAchievement('mission-complete');
        }
        
        // Verificar trend follower
        const trendUpCount = this.cryptos.filter(c => c.trend === 'up' && this.portfolio[c.symbol].amount > 0).length;
        if (trendUpCount >= 3 && !this.achievements.find(a => a.id === 'trend-follower').unlocked) {
            this.unlockAchievement('trend-follower');
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.balance += achievement.reward;
            this.addExperience(achievement.reward / 10);
            
            this.showNotification(`🏆 Conquista desbloqueada: ${achievement.name}! Recompensa: $${achievement.reward}`, 'success');
            this.updateUI();
        }
    }

    generateNews() {
        const newsTemplates = [
            { text: 'Bitcoin atinge nova máxima histórica!', sentiment: 'bullish', crypto: 'BTC' },
            { text: 'Regulamentações afetam mercado de criptomoedas', sentiment: 'bearish', crypto: null },
            { text: 'Ethereum 2.0 mostra progresso promissor', sentiment: 'bullish', crypto: 'ETH' },
            { text: 'Hackers atacam exchange popular', sentiment: 'bearish', crypto: null },
            { text: 'Adoção institucional cresce rapidamente', sentiment: 'bullish', crypto: null },
            { text: 'FUD espalha-se pelo mercado', sentiment: 'bearish', crypto: null }
        ];
        
        const news = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
        this.news.unshift({
            ...news,
            day: this.day,
            id: Date.now()
        });
        
        // Manter apenas as últimas 5 notícias
        if (this.news.length > 5) {
            this.news.pop();
        }
        
        // Aplicar efeito da notícia
        if (news.crypto) {
            const crypto = this.cryptos.find(c => c.symbol === news.crypto);
            if (crypto) {
                const multiplier = news.sentiment === 'bullish' ? 1.1 : 0.9;
                crypto.price *= multiplier;
            }
        }
    }

    startSpecialEvents() {
        setInterval(() => {
            if (Math.random() < 0.1 && !this.isPaused) { // 10% chance por dia
                this.triggerSpecialEvent();
            }
        }, 10000);
    }

    triggerSpecialEvent() {
        const events = [
            {
                name: 'Pump and Dump',
                description: 'Uma criptomoeda sofre manipulação de preço!',
                effect: () => {
                    const randomCrypto = this.cryptos[Math.floor(Math.random() * this.cryptos.length)];
                    randomCrypto.price *= 1.5;
                    this.showNotification(`🚀 ${randomCrypto.name} sofreu pump! Preço +50%`, 'info');
                }
            },
            {
                name: 'Market Crash',
                description: 'Mercado em pânico! Todas as criptomoedas caem.',
                effect: () => {
                    this.cryptos.forEach(crypto => {
                        crypto.price *= 0.8;
                    });
                    this.showNotification('📉 Crash do mercado! Todas as criptomoedas -20%', 'error');
                }
            },
            {
                name: 'Bull Run',
                description: 'Mercado em alta! Todas as criptomoedas sobem.',
                effect: () => {
                    this.cryptos.forEach(crypto => {
                        crypto.price *= 1.3;
                    });
                    this.showNotification('🚀 Bull run! Todas as criptomoedas +30%', 'success');
                }
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.specialEvents.unshift({
            ...event,
            day: this.day,
            id: Date.now()
        });
        
        event.effect();
        
        // Manter apenas os últimos 3 eventos
        if (this.specialEvents.length > 3) {
            this.specialEvents.pop();
        }
    }

    checkSpecialEvents() {
        // Verificar se algum evento especial deve ocorrer
    }

    getTotalPortfolioValue() {
        let totalValue = this.balance;
        Object.keys(this.portfolio).forEach(symbol => {
            const crypto = this.cryptos.find(c => c.symbol === symbol);
            if (crypto && this.portfolio[symbol].amount > 0) {
                totalValue += this.portfolio[symbol].amount * crypto.price;
            }
        });
        return totalValue;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause');
        pauseBtn.textContent = this.isPaused ? 'Continuar' : 'Pausar';
        pauseBtn.className = this.isPaused ? 'btn btn-success' : 'btn btn-secondary';
        
        this.showNotification(
            this.isPaused ? 'Jogo pausado' : 'Jogo continuando',
            'info'
        );
    }

    updateUI() {
        // Atualizar estatísticas básicas
        document.getElementById('balance').textContent = `$${this.balance.toLocaleString()}`;
        document.getElementById('portfolio-value').textContent = `$${this.getTotalPortfolioValue().toLocaleString()}`;
        document.getElementById('day').textContent = this.day;
        document.getElementById('level').textContent = this.level;
        document.getElementById('experience').textContent = `${this.experience}/${this.experienceToNextLevel}`;
        document.getElementById('risk-level').textContent = this.riskLevel;
        
        // Atualizar sentimento do mercado
        document.getElementById('market-sentiment').textContent = this.getSentimentEmoji() + ' ' + this.marketSentiment;
        
        // Atualizar lista de criptomoedas
        this.updateCryptoList();
        
        // Atualizar portfolio
        this.updatePortfolioDisplay();
        
        // Atualizar seletor de criptomoedas
        this.updateCryptoSelect();
        
        // Atualizar notícias
        this.updateNewsDisplay();
        
        // Atualizar eventos especiais
        this.updateEventsDisplay();
        
        // Atualizar conquistas
        this.updateAchievementsDisplay();
        
        // Atualizar estatísticas avançadas
        this.updateAdvancedStats();
        
        // Atualizar missões
        this.updateMissionsDisplay();
        
        // Atualizar leaderboard
        this.updateLeaderboardDisplay();
        
        // Salvar estado do jogo
        this.saveGameState();
    }

    getSentimentText() {
        switch (this.marketSentiment) {
            case 'bullish': return '📈 Bullish';
            case 'bearish': return '📉 Bearish';
            default: return '➡️ Neutral';
        }
    }

    updateCryptoList() {
        const cryptoList = document.getElementById('crypto-list');
        cryptoList.innerHTML = '';
        
        this.cryptos.forEach(crypto => {
            const cryptoItem = document.createElement('div');
            cryptoItem.className = 'crypto-item';
            
            // Calcular mudança percentual baseada no preço atual vs anterior
            const change = (Math.random() - 0.5) * 0.1; // ±5% para demonstração
            const changePercent = (change * 100).toFixed(2);
            const isPositive = change >= 0;
            
            cryptoItem.innerHTML = `
                <div class="crypto-header">
                    <span class="crypto-name">${crypto.name} (${crypto.symbol})</span>
                    <span class="crypto-price">$${crypto.price.toFixed(2)}</span>
                </div>
                <div class="crypto-details">
                    <span class="crypto-category">${crypto.category}</span>
                    <span class="crypto-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${changePercent}%
                    </span>
                </div>
            `;
            
            cryptoList.appendChild(cryptoItem);
        });
    }

    updatePortfolio() {
        let dailyProfit = 0;
        
        Object.keys(this.portfolio).forEach(symbol => {
            const holding = this.portfolio[symbol];
            if (holding.amount > 0) {
                const crypto = this.cryptos.find(c => c.symbol === symbol);
                if (crypto) {
                    const currentValue = holding.amount * crypto.price;
                    const avgValue = holding.amount * holding.avgPrice;
                    const profit = currentValue - avgValue;
                    dailyProfit += profit;
                }
            }
        });
        
        // Atualizar streak baseado no lucro diário
        if (dailyProfit > 0) {
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
        } else {
            this.streak = 0;
        }
        
        this.totalProfit += dailyProfit;
    }

    updateTradingSelect() {
        const select = document.getElementById('crypto-select');
        select.innerHTML = '<option value="">Selecione uma criptomoeda</option>';
        
        this.cryptos.forEach(crypto => {
            const option = document.createElement('option');
            option.value = crypto.symbol;
            option.textContent = `${crypto.name} (${crypto.symbol}) - $${crypto.price.toFixed(2)}`;
            select.appendChild(option);
        });
    }

    updateNews() {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;
        
        newsContainer.innerHTML = '';
        this.news.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = `news-item ${news.sentiment}`;
            newsItem.innerHTML = `
                <span class="news-day">Dia ${news.day}</span>
                <span class="news-text">${news.text}</span>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    updateSpecialEvents() {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;
        
        eventsContainer.innerHTML = '';
        this.specialEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <span class="event-day">Dia ${event.day}</span>
                <span class="event-name">${event.name}</span>
                <span class="event-description">${event.description}</span>
            `;
            eventsContainer.appendChild(eventItem);
        });
    }

    updateAchievements() {
        const achievementsContainer = document.getElementById('achievements-container');
        if (!achievementsContainer) return;
        
        achievementsContainer.innerHTML = '';
        this.achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            achievementItem.innerHTML = `
                <div class="achievement-header">
                    <span class="achievement-name">${achievement.name}</span>
                    <span class="achievement-reward">$${achievement.reward}</span>
                </div>
                <span class="achievement-description">${achievement.description}</span>
                <span class="achievement-status">${achievement.unlocked ? '✅ Desbloqueado' : '🔒 Bloqueado'}</span>
            `;
            achievementsContainer.appendChild(achievementItem);
        });
    }

    updateAdvancedStats() {
        const statsContainer = document.getElementById('advanced-stats');
        if (!statsContainer) return;
        
        const totalValue = this.getTotalPortfolioValue();
        const winRate = this.totalTrades > 0 ? (this.successfulTrades / this.totalTrades * 100).toFixed(1) : 0;
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Total de Trades:</span>
                <span class="stat-value">${this.totalTrades}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Taxa de Sucesso:</span>
                <span class="stat-value">${winRate}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Lucro Total:</span>
                <span class="stat-value ${this.totalProfit >= 0 ? 'positive' : 'negative'}">
                    ${this.totalProfit >= 0 ? '+' : ''}$${this.totalProfit.toFixed(2)}
                </span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Valor Total:</span>
                <span class="stat-value">$${totalValue.toFixed(2)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Sequência Atual:</span>
                <span class="stat-value">${this.streak} dias</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Sequência Máxima:</span>
                <span class="stat-value">${this.maxStreak} dias</span>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        // Remover notificação após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupHeaderScrollEffect() {
        const header = document.querySelector('.game-header');
        
        // Ajustar padding-top dinamicamente baseado na altura real do header
        const adjustContainerPadding = () => {
            const headerHeight = header.offsetHeight;
            const container = document.querySelector('.game-container');
            if (container) {
                // Para mobile, usar padding fixo otimizado
                if (window.innerWidth <= 390) {
                    container.style.paddingTop = '140px';
                } else {
                    container.style.paddingTop = (headerHeight + 40) + 'px';
                }
            }
        };
        
        // Ajustar após o carregamento da página
        window.addEventListener('load', adjustContainerPadding);
        window.addEventListener('resize', adjustContainerPadding);
        
        // Ajustar inicialmente
        adjustContainerPadding();
    }

    buyInsurance() {
        if (!this.insurance && this.balance >= 1000) {
            this.insurance = true;
            this.insuranceCost = 1000;
            this.insuranceDays = 7;
            this.balance -= 1000;
            this.showNotification('Seguro ativado por 7 dias!', 'info');
            this.saveGameState();
        } else if (this.insurance) {
            this.showNotification('Você já possui seguro ativo!', 'error');
        } else {
            this.showNotification('Saldo insuficiente para seguro!', 'error');
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.showNotification(`Som ${this.soundEnabled ? 'ativado' : 'desativado'}!`, 'info');
        this.updateUI();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.className = this.theme;
        this.showNotification(`Tema ${this.theme === 'light' ? 'claro' : 'escuro'} ativado!`, 'info');
        this.updateUI();
    }

    toggleFavorites() {
        const select = document.getElementById('crypto-select');
        const selectedCrypto = select.value;
        
        if (selectedCrypto && !this.favoriteCryptos.includes(selectedCrypto)) {
            this.favoriteCryptos.push(selectedCrypto);
            this.showNotification(`${selectedCrypto} adicionado aos favoritos!`, 'success');
        } else if (selectedCrypto && this.favoriteCryptos.includes(selectedCrypto)) {
            this.favoriteCryptos = this.favoriteCryptos.filter(c => c !== selectedCrypto);
            this.showNotification(`${selectedCrypto} removido dos favoritos!`, 'info');
        }
        
        this.updateUI();
    }

    checkMissions() {
        this.missions.forEach(mission => {
            if (mission.completed) return;
            
            switch (mission.id) {
                case 'daily-profit':
                    const dailyProfit = this.getDailyProfit();
                    mission.progress = Math.max(0, dailyProfit);
                    break;
                case 'buy-low':
                    // Verificar se comprou cripto que caiu 10%
                    break;
                case 'sell-high':
                    // Verificar se vendeu cripto que subiu 15%
                    break;
                case 'diversify':
                    const uniqueCryptos = Object.keys(this.portfolio).filter(symbol => 
                        this.portfolio[symbol].amount > 0
                    ).length;
                    mission.progress = uniqueCryptos;
                    break;
            }
            
            if (mission.progress >= mission.target) {
                mission.completed = true;
                this.balance += mission.reward;
                this.experience += mission.reward / 2;
                this.showNotification(`Missão completa: ${mission.name}! +$${mission.reward}`, 'success');
                this.checkLevelUp();
            }
        });
    }

    getDailyProfit() {
        if (this.portfolioHistory.length < 2) return 0;
        const today = this.portfolioHistory[this.portfolioHistory.length - 1];
        const yesterday = this.portfolioHistory[this.portfolioHistory.length - 2];
        return today.totalValue - yesterday.totalValue;
    }

    savePortfolioHistory() {
        const totalValue = this.getTotalPortfolioValue();
        this.portfolioHistory.push({
            day: this.day,
            balance: this.balance,
            portfolioValue: totalValue,
            totalValue: this.balance + totalValue
        });
        
        // Manter apenas os últimos 100 registros
        if (this.portfolioHistory.length > 100) {
            this.portfolioHistory.shift();
        }
    }

    loadGameState() {
        // Carregar estado do jogo (ex: localStorage)
        const savedState = localStorage.getItem('cryptoGameState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.balance = state.balance || 10000;
            this.day = state.day || 1;
            this.level = state.level || 1;
            this.experience = state.experience || 0;
            this.riskLevel = state.riskLevel || 1;
            this.totalProfit = state.totalProfit || 0;
            this.totalTrades = state.totalTrades || 0;
            this.successfulTrades = state.successfulTrades || 0;
            this.streak = state.streak || 0;
            this.maxStreak = state.maxStreak || 0;
            this.dailyBonus = state.dailyBonus || 0;
            this.insurance = state.insurance || false;
            this.insuranceDays = state.insuranceDays || 0;
            this.favoriteCryptos = state.favoriteCryptos || [];
            this.portfolio = state.portfolio || {};
            this.portfolioHistory = state.portfolioHistory || [];
            this.missions = state.missions || [];
            this.leaderboard = state.leaderboard || [];
            this.news = state.news || [];
            this.specialEvents = state.specialEvents || [];
            this.achievements = state.achievements || [];
            this.cryptos = state.cryptos || [];
            this.experienceToNextLevel = state.experienceToNextLevel || 100;
            this.theme = state.theme || 'light';
            document.body.className = this.theme;
        }
    }

    saveGameState() {
        const state = {
            balance: this.balance,
            day: this.day,
            level: this.level,
            experience: this.experience,
            riskLevel: this.riskLevel,
            totalProfit: this.totalProfit,
            totalTrades: this.totalTrades,
            successfulTrades: this.successfulTrades,
            streak: this.streak,
            maxStreak: this.maxStreak,
            dailyBonus: this.dailyBonus,
            insurance: this.insurance,
            insuranceDays: this.insuranceDays,
            favoriteCryptos: this.favoriteCryptos,
            portfolio: this.portfolio,
            portfolioHistory: this.portfolioHistory,
            missions: this.missions,
            leaderboard: this.leaderboard,
            news: this.news,
            specialEvents: this.specialEvents,
            achievements: this.achievements,
            cryptos: this.cryptos,
            experienceToNextLevel: this.experienceToNextLevel,
            theme: this.theme
        };
        localStorage.setItem('cryptoGameState', JSON.stringify(state));
    }

    checkLevelUp() {
        while (this.experience >= this.experienceToNextLevel) {
            this.experience -= this.experienceToNextLevel;
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        this.balance += this.level * 100; // Bônus por level
        this.showNotification(`🎉 Level Up! Agora você é nível ${this.level}! +$${this.level * 100}`, 'success');
        
        // Salvar estado do jogo
        this.saveGameState();
    }

    updateStreak() {
        if (this.streak >= 10) {
            this.unlockAchievement('streak-master');
        }
    }

    updatePortfolioDisplay() {
        const portfolioItems = document.getElementById('portfolio-items');
        if (!portfolioItems) return;
        
        portfolioItems.innerHTML = '';
        
        Object.keys(this.portfolio).forEach(symbol => {
            const holding = this.portfolio[symbol];
            if (holding.amount > 0) {
                const crypto = this.cryptos.find(c => c.symbol === symbol);
                if (crypto) {
                    const currentValue = holding.amount * crypto.price;
                    const avgValue = holding.amount * holding.avgPrice;
                    const profit = currentValue - avgValue;
                    const profitPercent = avgValue > 0 ? (profit / avgValue) * 100 : 0;
                    
                    const portfolioItem = document.createElement('div');
                    portfolioItem.className = 'portfolio-item';
                    portfolioItem.innerHTML = `
                        <div class="portfolio-header">
                            <span class="portfolio-name">${crypto.name} (${symbol})</span>
                            <span class="portfolio-value">$${currentValue.toFixed(2)}</span>
                        </div>
                        <div class="portfolio-details">
                            <span>Quantidade: ${holding.amount.toFixed(4)}</span>
                            <span>Preço Médio: $${holding.avgPrice.toFixed(2)}</span>
                        </div>
                        <div class="portfolio-extra">
                            <span>Lucro: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}</span>
                            <span>${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%</span>
                        </div>
                    `;
                    
                    portfolioItems.appendChild(portfolioItem);
                }
            }
        });
    }

    updateCryptoSelect() {
        const cryptoSelect = document.getElementById('crypto-select');
        if (!cryptoSelect) return;
        
        cryptoSelect.innerHTML = '<option value="">Selecione uma criptomoeda</option>';
        
        this.cryptos.forEach(crypto => {
            const option = document.createElement('option');
            option.value = crypto.symbol;
            option.textContent = `${crypto.name} (${crypto.symbol}) - $${crypto.price.toLocaleString()}`;
            cryptoSelect.appendChild(option);
        });
    }

    updateMissionsDisplay() {
        const missionsContainer = document.getElementById('missions-container');
        if (!missionsContainer) return;
        
        missionsContainer.innerHTML = '';
        
        this.missions.forEach(mission => {
            const missionItem = document.createElement('div');
            missionItem.className = `mission-item ${mission.completed ? 'completed' : ''}`;
            
            const progressPercent = Math.min((mission.progress / mission.target) * 100, 100);
            
            missionItem.innerHTML = `
                <div class="mission-header">
                    <span class="mission-name">${mission.name}</span>
                    <span class="mission-reward">$${mission.reward}</span>
                </div>
                <span class="mission-description">${mission.description}</span>
                <div class="mission-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="progress-text">${mission.progress}/${mission.target}</span>
                </div>
                <span class="mission-status">${mission.completed ? '✅ Completa' : '🔄 Em andamento'}</span>
            `;
            
            missionsContainer.appendChild(missionItem);
        });
    }

    updateLeaderboardDisplay() {
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (!leaderboardContainer) return;
        
        leaderboardContainer.innerHTML = '';
        
        // Adicionar jogador atual ao topo
        const currentPlayer = {
            name: 'Você',
            balance: this.balance,
            level: this.level,
            totalProfit: this.totalProfit
        };
        
        const allPlayers = [currentPlayer, ...this.leaderboard];
        allPlayers.sort((a, b) => b.balance - a.balance);
        
        allPlayers.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = `leaderboard-item ${player.name === 'Você' ? 'current-player' : ''}`;
            
            const rank = index + 1;
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            playerItem.innerHTML = `
                <div class="player-rank">${rankIcon}</div>
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <span class="player-level">Nível ${player.level}</span>
                </div>
                <div class="player-stats">
                    <span class="player-balance">$${player.balance.toLocaleString()}</span>
                    <span class="player-profit">${player.totalProfit >= 0 ? '+' : ''}$${player.totalProfit.toLocaleString()}</span>
                </div>
            `;
            
            leaderboardContainer.appendChild(playerItem);
        });
    }

    generateNews() {
        if (Math.random() < 0.4) {
            const newsTypes = [
                { type: 'bullish', text: 'Institucionais aumentam exposição em Bitcoin', emoji: '🚀' },
                { type: 'bearish', text: 'Regulamentações preocupam investidores', emoji: '📉' },
                { type: 'neutral', text: 'Novas tecnologias blockchain prometem inovação', emoji: '🔬' },
                { type: 'bullish', text: 'Adoção de criptomoedas cresce globalmente', emoji: '🌍' },
                { type: 'bearish', text: 'Volatilidade do mercado assusta investidores', emoji: '😰' }
            ];
            
            const news = newsTypes[Math.floor(Math.random() * newsTypes.length)];
            this.news.unshift({
                day: this.day,
                text: news.text,
                type: news.type,
                emoji: news.emoji
            });
            
            // Manter apenas as últimas 10 notícias
            if (this.news.length > 10) {
                this.news.pop();
            }
        }
    }

    updateNewsDisplay() {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;
        
        newsContainer.innerHTML = '';
        
        this.news.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = `news-item ${news.type}`;
            newsItem.innerHTML = `
                <span class="news-day">Dia ${news.day}</span>
                <span class="news-text">${news.emoji} ${news.text}</span>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    startSpecialEvents() {
        // Eventos especiais que afetam o mercado
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% de chance por intervalo
                this.triggerSpecialEvent();
            }
        }, 60000); // Verificar a cada minuto
    }

    triggerSpecialEvent() {
        const events = [
            { name: 'Halving do Bitcoin', description: 'Redução da recompensa de mineração', effect: 'bullish' },
            { name: 'Fork da Ethereum', description: 'Atualização da rede principal', effect: 'neutral' },
            { name: 'Regulamentação', description: 'Novas leis sobre criptomoedas', effect: 'bearish' },
            { name: 'Adoção Corporativa', description: 'Grande empresa aceita pagamentos em crypto', effect: 'bullish' },
            { name: 'Hack de Exchange', description: 'Roubo de fundos de exchange', effect: 'bearish' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.specialEvents.unshift({
            day: this.day,
            name: event.name,
            description: event.description,
            effect: event.effect
        });
        
        // Manter apenas os últimos 5 eventos
        if (this.specialEvents.length > 5) {
            this.specialEvents.pop();
        }
        
        this.showNotification(`Evento especial: ${event.name}`, 'info');
        
        // Aplicar efeito no mercado
        this.applyEventEffect(event.effect);
    }

    applyEventEffect(effect) {
        this.cryptos.forEach(crypto => {
            let multiplier = 1;
            switch (effect) {
                case 'bullish':
                    multiplier = 1 + (Math.random() * 0.1); // +0% a +10%
                    break;
                case 'bearish':
                    multiplier = 1 - (Math.random() * 0.1); // -0% a -10%
                    break;
                case 'neutral':
                    multiplier = 1 + (Math.random() * 0.05 - 0.025); // -2.5% a +2.5%
                    break;
            }
            crypto.price *= multiplier;
        });
    }

    updateEventsDisplay() {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;
        
        eventsContainer.innerHTML = '';
        
        this.specialEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = `event-item ${event.effect}`;
            eventItem.innerHTML = `
                <span class="event-day">Dia ${event.day}</span>
                <span class="event-name">${event.name}</span>
                <span class="event-description">${event.description}</span>
            `;
            eventsContainer.appendChild(eventItem);
        });
    }

    getSentimentEmoji() {
        switch (this.marketSentiment) {
            case 'bullish': return '🚀';
            case 'bearish': return '🐻';
            default: return '➡️';
        }
    }

    updateAdvancedStats() {
        const statsContainer = document.getElementById('advanced-stats');
        if (!statsContainer) return;
        
        const totalValue = this.getTotalPortfolioValue();
        const winRate = this.totalTrades > 0 ? (this.successfulTrades / this.totalTrades * 100).toFixed(1) : 0;
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Total de Trades:</span>
                <span class="stat-value">${this.totalTrades}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Taxa de Sucesso:</span>
                <span class="stat-value">${winRate}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Lucro Total:</span>
                <span class="stat-value ${this.totalProfit >= 0 ? 'positive' : 'negative'}">
                    ${this.totalProfit >= 0 ? '+' : ''}$${this.totalProfit.toFixed(2)}
                </span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Valor Total:</span>
                <span class="stat-value">$${totalValue.toFixed(2)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Sequência Atual:</span>
                <span class="stat-value">${this.streak} dias</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Sequência Máxima:</span>
                <span class="stat-value">${this.maxStreak} dias</span>
            </div>
        `;
    }

    updateAchievementsDisplay() {
        const achievementsContainer = document.getElementById('achievements-container');
        if (!achievementsContainer) return;
        
        achievementsContainer.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            achievementItem.innerHTML = `
                <div class="achievement-header">
                    <span class="achievement-name">${achievement.name}</span>
                    <span class="achievement-reward">$${achievement.reward}</span>
                </div>
                <span class="achievement-description">${achievement.description}</span>
                <span class="achievement-status">${achievement.unlocked ? '✅ Desbloqueado' : '🔒 Bloqueado'}</span>
            `;
            achievementsContainer.appendChild(achievementItem);
        });
    }

    updateGameInfo() {
        // Atualizar informações adicionais do jogo
        const streakDisplay = document.getElementById('streak-display');
        const maxStreakDisplay = document.getElementById('max-streak-display');
        const dailyBonusDisplay = document.getElementById('daily-bonus-display');
        const insuranceStatus = document.getElementById('insurance-status');
        
        if (streakDisplay) streakDisplay.textContent = this.streak;
        if (maxStreakDisplay) maxStreakDisplay.textContent = this.maxStreak;
        if (dailyBonusDisplay) dailyBonusDisplay.textContent = `$${this.dailyBonus}`;
        if (insuranceStatus) {
            insuranceStatus.textContent = this.insurance ? `Ativo (${this.insuranceDays} dias)` : 'Inativo';
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.balance += achievement.reward;
            this.experience += achievement.reward / 2;
            this.showNotification(`🏆 Conquista desbloqueada: ${achievement.name}! +$${achievement.reward}`, 'success');
            this.checkLevelUp();
            this.saveGameState();
        }
    }

    checkAchievements() {
        // Verificar primeira compra
        if (this.totalTrades === 1) {
            this.unlockAchievement('first-trade');
        }
        
        // Verificar lucro de $1000
        if (this.totalProfit >= 1000 && !this.achievements.find(a => a.id === 'profit-maker').unlocked) {
            this.unlockAchievement('profit-maker');
        }
        
        // Verificar diversificação
        const uniqueCryptos = Object.keys(this.portfolio).filter(symbol => 
            this.portfolio[symbol].amount > 0
        ).length;
        if (uniqueCryptos >= 5 && !this.achievements.find(a => a.id === 'diversifier').unlocked) {
            this.unlockAchievement('diversifier');
        }
        
        // Verificar milionário
        if (this.balance >= 1000000 && !this.achievements.find(a => a.id === 'millionaire').unlocked) {
            this.unlockAchievement('millionaire');
        }
        
        // Verificar day trader
        if (this.totalTrades >= 50 && !this.achievements.find(a => a.id === 'day-trader').unlocked) {
            this.unlockAchievement('day-trader');
        }
        
        // Verificar HODLer
        Object.keys(this.portfolio).forEach(symbol => {
            const holding = this.portfolio[symbol];
            if (holding.amount > 0 && holding.firstBuyDay > 0) {
                const daysHeld = this.day - holding.firstBuyDay;
                if (daysHeld >= 30 && !this.achievements.find(a => a.id === 'hodler').unlocked) {
                    this.unlockAchievement('hodler');
                }
            }
        });
        
        // Verificar streak master
        if (this.streak >= 10 && !this.achievements.find(a => a.id === 'streak-master').unlocked) {
            this.unlockAchievement('streak-master');
        }
        
        // Verificar risk taker
        if (this.riskLevel === 5 && !this.achievements.find(a => a.id === 'risk-taker').unlocked) {
            this.unlockAchievement('risk-taker');
        }
        
        // Verificar mission complete
        const completedMissions = this.missions.filter(m => m.completed).length;
        if (completedMissions >= 20 && !this.achievements.find(a => a.id === 'mission-complete').unlocked) {
            this.unlockAchievement('mission-complete');
        }
        
        // Verificar trend follower
        const trendUpCount = this.cryptos.filter(c => c.trend === 'up' && this.portfolio[c.symbol].amount > 0).length;
        if (trendUpCount >= 3 && !this.achievements.find(a => a.id === 'trend-follower').unlocked) {
            this.unlockAchievement('trend-follower');
        }
    }

    changeRisk(delta) {
        const newRisk = Math.max(1, Math.min(5, this.riskLevel + delta));
        if (newRisk !== this.riskLevel) {
            this.riskLevel = newRisk;
            this.showNotification(`Nível de risco alterado para: ${this.riskLevel}`, 'info');
            this.updateUI();
            this.saveGameState();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause');
        if (pauseBtn) {
            pauseBtn.textContent = this.isPaused ? 'Continuar' : 'Pausar';
            pauseBtn.className = this.isPaused ? 'btn btn-success' : 'btn btn-secondary';
        }
        this.showNotification(this.isPaused ? 'Jogo pausado' : 'Jogo retomado', 'info');
        this.saveGameState();
    }

    getTotalPortfolioValue() {
        let total = 0;
        Object.keys(this.portfolio).forEach(symbol => {
            const holding = this.portfolio[symbol];
            if (holding.amount > 0) {
                const crypto = this.cryptos.find(c => c.symbol === symbol);
                if (crypto) {
                    total += holding.amount * crypto.price;
                }
            }
        });
        return total;
    }

    getSentimentMultiplier() {
        switch (this.marketSentiment) {
            case 'bullish': return 1.2;
            case 'bearish': return 0.8;
            default: return 1.0;
        }
    }

    updateMarketSentiment() {
        const random = Math.random();
        if (random < 0.3) {
            this.marketSentiment = 'bullish';
        } else if (random < 0.6) {
            this.marketSentiment = 'bearish';
        } else {
            this.marketSentiment = 'neutral';
        }
    }

    showNotification(message, type = 'success') {
        const notifications = document.getElementById('notifications');
        if (!notifications) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        // Remover notificação após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Função para resetar o jogo
    resetGame() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todos os progressos serão perdidos.')) {
            localStorage.removeItem('cryptoGameState');
            location.reload();
        }
    }

    // Função para salvar automaticamente
    autoSave() {
        setInterval(() => {
            this.saveGameState();
        }, 30000); // Salvar a cada 30 segundos
    }

    // Função para carregar dados iniciais se não existirem
    initializeDefaultData() {
        if (!this.news.length) {
            this.generateNews();
        }
        if (!this.specialEvents.length) {
            this.startSpecialEvents();
        }
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const game = new CryptoGame();
    
    // Adicionar event listener para reset
    const resetBtn = document.getElementById('reset-game');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => game.resetGame());
    }
    
    // Iniciar auto-save
    game.autoSave();
    
    // Inicializar dados padrão
    game.initializeDefaultData();
    
    // Atualizar informações do jogo
    game.updateGameInfo();
});
