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
        this.riskLevel = 1;
        this.marketSentiment = 'neutral';
        
        // Novas funcionalidades
        this.missions = [];
        this.leaderboard = [];
        this.streak = 0;
        this.maxStreak = 0;
        this.dailyBonus = 0;
        this.insurance = false;
        this.insuranceCost = 0;
        this.insuranceDays = 0;
        this.tradingFee = 0.001;
        this.portfolioHistory = [];
        this.favoriteCryptos = [];
        this.notifications = [];
        this.soundEnabled = true;
        this.theme = 'light';
        
        // Sistema de tempo melhorado
        this.timeSpeed = 1;
        this.autoAdvance = true;
        this.dayInterval = 30000;
        this.lastDayAdvance = Date.now();
        this.isProcessingNextDay = false; // Proteção contra múltiplos cliques
        
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
        this.startTimeSystem();
    }

    initializeGame() {
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
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');
        
        // Botão próximo dia com proteção
        const nextDayBtn = document.getElementById('next-day');
        if (nextDayBtn) {
            console.log('✅ Botão próximo dia encontrado');
            nextDayBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão próximo dia clicado');
                e.preventDefault();
                e.stopPropagation();
                this.nextDay();
            });
        } else {
            console.log('❌ Botão próximo dia NÃO encontrado');
        }
        
        // Botão pause
        const pauseBtn = document.getElementById('pause');
        if (pauseBtn) {
            console.log('✅ Botão pause encontrado');
            pauseBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão pause clicado');
                e.preventDefault();
                e.stopPropagation();
                this.togglePause();
            });
        } else {
            console.log('❌ Botão pause NÃO encontrado');
        }
        
        // Botão auto advance
        const autoAdvanceBtn = document.getElementById('auto-advance');
        if (autoAdvanceBtn) {
            console.log('✅ Botão auto advance encontrado');
            autoAdvanceBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão auto advance clicado');
                e.preventDefault();
                e.stopPropagation();
                this.toggleAutoAdvance();
            });
        } else {
            console.log('❌ Botão auto advance NÃO encontrado');
        }
        
        // Botões de trading
        const buyBtn = document.getElementById('buy-btn');
        if (buyBtn) {
            console.log('✅ Botão comprar encontrado');
            buyBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão comprar clicado');
                e.preventDefault();
                e.stopPropagation();
                this.buy();
            });
        } else {
            console.log('❌ Botão comprar NÃO encontrado');
        }
        
        const sellBtn = document.getElementById('sell-btn');
        if (sellBtn) {
            console.log('✅ Botão vender encontrado');
            sellBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão vender clicado');
                e.preventDefault();
                e.stopPropagation();
                this.sell();
            });
        } else {
            console.log('❌ Botão vender NÃO encontrado');
        }
        
        // Controles de risco
        const riskIncreaseBtn = document.getElementById('risk-increase');
        if (riskIncreaseBtn) {
            console.log('✅ Botão aumentar risco encontrado');
            riskIncreaseBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão aumentar risco clicado');
                e.preventDefault();
                e.stopPropagation();
                this.changeRisk(1);
            });
        } else {
            console.log('❌ Botão aumentar risco NÃO encontrado');
        }
        
        const riskDecreaseBtn = document.getElementById('risk-decrease');
        if (riskDecreaseBtn) {
            console.log('✅ Botão diminuir risco encontrado');
            riskDecreaseBtn.addEventListener('click', (e) => {
                console.log('🖱️ Botão diminuir risco clicado');
                e.preventDefault();
                e.stopPropagation();
                this.changeRisk(-1);
            });
        } else {
            console.log('❌ Botão diminuir risco NÃO encontrado');
        }
        
        // Controles de velocidade
        const speed05Btn = document.getElementById('speed-0.5');
        if (speed05Btn) {
            console.log('✅ Botão velocidade 0.5x encontrado');
            speed05Btn.addEventListener('click', (e) => {
                console.log('🖱️ Botão velocidade 0.5x clicado');
                e.preventDefault();
                e.stopPropagation();
                this.setTimeSpeed(0.5);
            });
        } else {
            console.log('❌ Botão velocidade 0.5x NÃO encontrado');
        }
        
        const speed1Btn = document.getElementById('speed-1');
        if (speed1Btn) {
            console.log('✅ Botão velocidade 1x encontrado');
            speed1Btn.addEventListener('click', (e) => {
                console.log('🖱️ Botão velocidade 1x clicado');
                e.preventDefault();
                e.stopPropagation();
                this.setTimeSpeed(1);
            });
        } else {
            console.log('❌ Botão velocidade 1x NÃO encontrado');
        }
        
        const speed2Btn = document.getElementById('speed-2');
        if (speed2Btn) {
            console.log('✅ Botão velocidade 2x encontrado');
            speed2Btn.addEventListener('click', (e) => {
                console.log('🖱️ Botão velocidade 2x clicado');
                e.preventDefault();
                e.stopPropagation();
                this.setTimeSpeed(2);
            });
        } else {
            console.log('❌ Botão velocidade 2x NÃO encontrado');
        }
        
        const speed5Btn = document.getElementById('speed-5');
        if (speed5Btn) {
            console.log('✅ Botão velocidade 5x encontrado');
            speed5Btn.addEventListener('click', (e) => {
                console.log('🖱️ Botão velocidade 5x clicado');
                e.preventDefault();
                e.stopPropagation();
                this.setTimeSpeed(5);
            });
        } else {
            console.log('❌ Botão velocidade 5x NÃO encontrado');
        }
        
        console.log('🔧 Event listeners configurados!');
        
        // Novos event listeners
        this.setupNewEventListeners();
    }

    setupNewEventListeners() {
        const buyInsuranceBtn = document.getElementById('buy-insurance');
        if (buyInsuranceBtn) {
            buyInsuranceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.buyInsurance();
            });
        }
        
        const toggleSoundBtn = document.getElementById('toggle-sound');
        if (toggleSoundBtn) {
            toggleSoundBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSound();
            });
        }
        
        const toggleThemeBtn = document.getElementById('toggle-theme');
        if (toggleThemeBtn) {
            toggleThemeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }
        
        const addFavoritesBtn = document.getElementById('add-favorites');
        if (addFavoritesBtn) {
            addFavoritesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavorites();
            });
        }
    }

    toggleAutoAdvance() {
        this.autoAdvance = !this.autoAdvance;
        const autoBtn = document.getElementById('auto-advance');
        if (autoBtn) {
            autoBtn.textContent = this.autoAdvance ? '🔄 Auto' : '⏹️ Manual';
            autoBtn.className = this.autoAdvance ? 'btn btn-success' : 'btn btn-secondary';
        }
        this.showNotification(this.autoAdvance ? 'Avanço automático ativado' : 'Avanço automático desativado', 'info');
        this.updateUI();
        this.saveGameState();
    }

    setTimeSpeed(speed) {
        this.timeSpeed = speed;
        
        // Atualizar botões ativos
        document.querySelectorAll('.speed-controls .btn').forEach(btn => {
            btn.classList.remove('btn-active');
        });
        
        // Ativar botão selecionado
        const selectedBtn = document.getElementById(`speed-${speed}`);
        if (selectedBtn) {
            selectedBtn.classList.add('btn-active');
        }
        
        // Atualizar informações de tempo
        this.updateTimeInfo();
        
        this.showNotification(`Velocidade alterada para ${speed}x`, 'info');
        this.saveGameState();
    }

    updateTimeInfo() {
        const timeInfo = document.getElementById('time-info');
        const timeSpeedDisplay = document.getElementById('time-speed-display');
        const nextDayCountdown = document.getElementById('next-day-countdown');
        
        if (timeInfo) {
            const baseTime = 30;
            const adjustedTime = Math.round(baseTime / this.timeSpeed);
            timeInfo.textContent = `⏱️ ${adjustedTime}s/dia`;
        }
        
        if (timeSpeedDisplay) {
            timeSpeedDisplay.textContent = `${this.timeSpeed}x`;
        }
        
        if (nextDayCountdown) {
            this.updateCountdown();
        }
    }

    updateCountdown() {
        const nextDayCountdown = document.getElementById('next-day-countdown');
        if (!nextDayCountdown) return;
        
        const now = Date.now();
        const timeSinceLastAdvance = now - this.lastDayAdvance;
        const adjustedInterval = this.dayInterval / this.timeSpeed;
        const timeRemaining = Math.max(0, adjustedInterval - timeSinceLastAdvance);
        
        if (timeRemaining > 0) {
            const seconds = Math.ceil(timeRemaining / 1000);
            nextDayCountdown.textContent = `${seconds}s`;
        } else {
            nextDayCountdown.textContent = 'Agora!';
        }
    }

    startTimeSystem() {
        setInterval(() => {
            if (this.autoAdvance && !this.isPaused) {
                const now = Date.now();
                const timeSinceLastAdvance = now - this.lastDayAdvance;
                const adjustedInterval = this.dayInterval / this.timeSpeed;
                
                if (timeSinceLastAdvance >= adjustedInterval) {
                    this.nextDay();
                    this.lastDayAdvance = now;
                }
                
                this.updateCountdown();
            }
        }, 1000);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause');
        if (pauseBtn) {
            pauseBtn.textContent = this.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
            pauseBtn.className = this.isPaused ? 'btn btn-success' : 'btn btn-secondary';
        }
        this.showNotification(this.isPaused ? 'Jogo pausado' : 'Jogo retomado', 'info');
        this.updateUI();
        this.saveGameState();
    }

    nextDay() {
        console.log('🕐 Função nextDay chamada');
        
        // Proteção contra múltiplos cliques
        if (this.isProcessingNextDay) {
            console.log('⚠️ nextDay já está sendo processado, ignorando clique');
            return;
        }
        
        console.log('✅ Iniciando processamento do próximo dia');
        this.isProcessingNextDay = true;
        
        // Reset do sistema automático quando usar botão manual
        this.lastDayAdvance = Date.now();
        console.log('🔄 Reset do sistema automático');
        
        this.day++;
        console.log(`📅 Dia alterado para: ${this.day}`);
        
        this.updateMarketSentiment();
        console.log('📊 Sentimento do mercado atualizado');
        
        this.cryptos.forEach(crypto => {
            const baseChange = (Math.random() - 0.5) * 2 * crypto.volatility;
            const sentimentMultiplier = this.getSentimentMultiplier();
            const riskMultiplier = this.riskLevel * 0.2;
            
            const change = baseChange * sentimentMultiplier * (1 + riskMultiplier);
            const oldPrice = crypto.price;
            crypto.price *= (1 + change);
            crypto.price = Math.max(crypto.price, 0.01);
            
            if (crypto.price > oldPrice) {
                crypto.trend = 'up';
            } else if (crypto.price < oldPrice) {
                crypto.trend = 'down';
            } else {
                crypto.trend = 'neutral';
            }
            
            crypto.lastUpdate = this.day;
        });
        
        console.log('💰 Preços das criptomoedas atualizados');
        
        this.updatePortfolio();
        this.checkAchievements();
        this.checkMissions();
        this.updateStreak();
        this.applyDailyBonus();
        this.checkInsurance();
        this.savePortfolioHistory();
        this.updateUI();
        this.generateNews();
        this.checkSpecialEvents();
        
        this.showNotification(`Dia ${this.day} - Preços atualizados!`, 'success');
        console.log('✅ Próximo dia processado com sucesso');
        
        // Liberar o processamento após um pequeno delay
        setTimeout(() => {
            this.isProcessingNextDay = false;
            console.log('🔓 Processamento liberado para próximo clique');
        }, 500);
    }

    updateUI() {
        document.getElementById('balance').textContent = `$${this.balance.toLocaleString()}`;
        document.getElementById('portfolio-value').textContent = `$${this.getTotalPortfolioValue().toLocaleString()}`;
        document.getElementById('day').textContent = this.day;
        document.getElementById('level').textContent = this.level;
        document.getElementById('experience').textContent = `${this.experience}/${this.experienceToNextLevel}`;
        document.getElementById('risk-level').textContent = this.riskLevel;
        
        document.getElementById('market-sentiment').textContent = this.getSentimentEmoji() + ' ' + this.marketSentiment;
        
        this.updateTimeInfo();
        this.updateCryptoList();
        this.updatePortfolioDisplay();
        this.updateCryptoSelect();
        this.updateNewsDisplay();
        this.updateEventsDisplay();
        this.updateAchievementsDisplay();
        this.updateAdvancedStats();
        this.updateMissionsDisplay();
        this.updateLeaderboardDisplay();
        this.updateGameInfo();
        
        this.saveGameState();
    }

    updateCryptoList() {
        const cryptoList = document.getElementById('crypto-list');
        if (!cryptoList) return;
        
        cryptoList.innerHTML = '';
        
        this.cryptos.forEach(crypto => {
            const cryptoItem = document.createElement('div');
            cryptoItem.className = 'crypto-item';
            
            const change = ((crypto.price - crypto.price * 0.95) / (crypto.price * 0.95)) * 100;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSymbol = change >= 0 ? '+' : '';
            
            cryptoItem.innerHTML = `
                <div class="crypto-info">
                    <div class="crypto-name">${crypto.name} (${crypto.symbol})</div>
                    <div class="crypto-price">$${crypto.price.toFixed(2)}</div>
                </div>
                <div class="crypto-change ${changeClass}">
                    ${changeSymbol}${change.toFixed(2)}%
                </div>
            `;
            
            cryptoList.appendChild(cryptoItem);
        });
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
                    const profit = currentValue - (holding.amount * holding.avgPrice);
                    const profitPercent = holding.avgPrice > 0 ? ((crypto.price - holding.avgPrice) / holding.avgPrice) * 100 : 0;
                    
                    const portfolioItem = document.createElement('div');
                    portfolioItem.className = 'portfolio-item';
                    portfolioItem.innerHTML = `
                        <div>
                            <strong>${crypto.name}</strong><br>
                            <small>${holding.amount.toFixed(4)} ${symbol}</small>
                        </div>
                        <div>
                            <div>$${currentValue.toFixed(2)}</div>
                            <div class="${profit >= 0 ? 'positive' : 'negative'}">
                                ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)
                            </div>
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
            option.textContent = `${crypto.name} (${crypto.symbol}) - $${crypto.price.toFixed(2)}`;
            cryptoSelect.appendChild(option);
        });
    }

    buy() {
        const symbol = document.getElementById('crypto-select').value;
        const amount = parseFloat(document.getElementById('amount').value);
        
        if (!symbol || !amount || amount <= 0) {
            this.showNotification('Selecione uma criptomoeda e insira uma quantidade válida', 'error');
            return;
        }
        
        const crypto = this.cryptos.find(c => c.symbol === symbol);
        if (!crypto) return;
        
        const totalCost = amount * crypto.price;
        const fee = totalCost * this.tradingFee;
        const totalWithFee = totalCost + fee;
        
        if (totalWithFee > this.balance) {
            this.showNotification('Saldo insuficiente para esta compra', 'error');
            return;
        }
        
        this.balance -= totalWithFee;
        
        if (this.portfolio[symbol].amount === 0) {
            this.portfolio[symbol].firstBuyDay = this.day;
        }
        
        const currentTotal = this.portfolio[symbol].amount * this.portfolio[symbol].avgPrice;
        const newTotal = currentTotal + totalCost;
        this.portfolio[symbol].amount += amount;
        this.portfolio[symbol].avgPrice = newTotal / this.portfolio[symbol].amount;
        this.portfolio[symbol].lastTradeDay = this.day;
        this.portfolio[symbol].totalBought += totalCost;
        
        this.totalTrades++;
        this.experience += 10;
        
        this.checkLevelUp();
        this.showNotification(`Comprou ${amount.toFixed(4)} ${symbol} por $${totalCost.toFixed(2)}`, 'success');
        this.updateUI();
    }

    sell() {
        const symbol = document.getElementById('crypto-select').value;
        const amount = parseFloat(document.getElementById('amount').value);
        
        if (!symbol || !amount || amount <= 0) {
            this.showNotification('Selecione uma criptomoeda e insira uma quantidade válida', 'error');
            return;
        }
        
        const holding = this.portfolio[symbol];
        if (holding.amount < amount) {
            this.showNotification('Quantidade insuficiente para venda', 'error');
            return;
        }
        
        const crypto = this.cryptos.find(c => c.symbol === symbol);
        if (!crypto) return;
        
        const totalValue = amount * crypto.price;
        const fee = totalValue * this.tradingFee;
        const netValue = totalValue - fee;
        
        this.balance += netValue;
        holding.amount -= amount;
        holding.lastTradeDay = this.day;
        holding.totalSold += totalValue;
        
        if (holding.amount === 0) {
            holding.avgPrice = 0;
        }
        
        this.totalTrades++;
        this.experience += 15;
        
        const profit = totalValue - (amount * holding.avgPrice);
        if (profit > 0) {
            this.successfulTrades++;
        }
        
        this.checkLevelUp();
        this.showNotification(`Vendeu ${amount.toFixed(4)} ${symbol} por $${totalValue.toFixed(2)}`, 'success');
        this.updateUI();
    }

    changeRisk(delta) {
        const newRisk = Math.max(1, Math.min(5, this.riskLevel + delta));
        if (newRisk !== this.riskLevel) {
            this.riskLevel = newRisk;
            this.showNotification(`Nível de risco alterado para ${this.riskLevel}`, 'info');
            this.updateUI();
        }
    }

    getTotalPortfolioValue() {
        let total = 0;
        Object.keys(this.portfolio).forEach(symbol => {
            const holding = this.portfolio[symbol];
            const crypto = this.cryptos.find(c => c.symbol === symbol);
            if (crypto && holding.amount > 0) {
                total += holding.amount * crypto.price;
            }
        });
        return total;
    }

    updatePortfolio() {
        const totalValue = this.getTotalPortfolioValue();
        const oldTotal = this.balance + totalValue;
        const dailyProfit = oldTotal - 10000;
        
        if (dailyProfit > 0) {
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
        } else {
            this.streak = 0;
        }
    }

    checkLevelUp() {
        if (this.experience >= this.experienceToNextLevel) {
            this.level++;
            this.experience -= this.experienceToNextLevel;
            this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
            
            this.showNotification(`🎉 Nível ${this.level} alcançado!`, 'success');
            this.checkAchievements();
        }
    }

    checkAchievements() {
        const newAchievements = [];
        
        if (this.level >= 5 && !this.achievements.includes('level-5')) {
            newAchievements.push('level-5');
        }
        
        if (this.totalTrades >= 50 && !this.achievements.includes('trader')) {
            newAchievements.push('trader');
        }
        
        if (this.successfulTrades >= 25 && !this.achievements.includes('profitable')) {
            newAchievements.push('profitable');
        }
        
        if (this.streak >= 7 && !this.achievements.includes('streak-master')) {
            newAchievements.push('streak-master');
        }
        
        if (this.riskLevel >= 4 && !this.achievements.includes('risk-taker')) {
            newAchievements.push('risk-taker');
        }
        
        newAchievements.forEach(achievement => {
            this.unlockAchievement(achievement);
        });
    }

    unlockAchievement(achievement) {
        if (!this.achievements.includes(achievement)) {
            this.achievements.push(achievement);
            this.experience += 50;
            this.showNotification(`🏆 Conquista desbloqueada: ${this.getAchievementName(achievement)}`, 'success');
        }
    }

    getAchievementName(achievement) {
        const names = {
            'level-5': 'Nível 5',
            'trader': 'Trader Ativo',
            'profitable': 'Lucrativo',
            'streak-master': 'Mestre da Sequência',
            'risk-taker': 'Apostador'
        };
        return names[achievement] || achievement;
    }

    initializeMissions() {
        this.missions = [
            { id: 'daily-trade', name: 'Faça 3 trades hoje', target: 3, current: 0, reward: 100 },
            { id: 'profit-streak', name: 'Mantenha lucro por 5 dias', target: 5, current: 0, reward: 200 },
            { id: 'portfolio-value', name: 'Atinga $15,000 no portfolio', target: 15000, current: 0, reward: 300 }
        ];
    }

    checkMissions() {
        this.missions.forEach(mission => {
            switch (mission.id) {
                case 'daily-trade':
                    mission.current = this.totalTrades;
                    break;
                case 'profit-streak':
                    mission.current = this.streak;
                    break;
                case 'portfolio-value':
                    mission.current = this.getTotalPortfolioValue();
                    break;
            }
            
            if (mission.current >= mission.target && !mission.completed) {
                mission.completed = true;
                this.balance += mission.reward;
                this.showNotification(`🎯 Missão completa: ${mission.name}`, 'success');
            }
        });
    }

    initializeLeaderboard() {
        this.leaderboard = [
            { name: 'CryptoKing', score: 150000, level: 25 },
            { name: 'BitcoinBaron', score: 120000, level: 20 },
            { name: 'EthereumElite', score: 95000, level: 18 },
            { name: 'DeFiDuke', score: 80000, level: 15 },
            { name: 'AltcoinAce', score: 65000, level: 12 }
        ];
    }

    updateStreak() {
        // Implementação do streak já está em updatePortfolio
    }

    applyDailyBonus() {
        if (this.streak > 0) {
            this.dailyBonus = this.streak * 10;
            this.balance += this.dailyBonus;
        }
    }

    checkInsurance() {
        if (this.insurance && this.insuranceDays > 0) {
            this.insuranceDays--;
            if (this.insuranceDays === 0) {
                this.insurance = false;
                this.showNotification('Seguro expirou', 'info');
            }
        }
    }

    savePortfolioHistory() {
        const historyEntry = {
            day: this.day,
            balance: this.balance,
            portfolioValue: this.getTotalPortfolioValue(),
            totalValue: this.balance + this.getTotalPortfolioValue()
        };
        
        this.portfolioHistory.push(historyEntry);
        
        if (this.portfolioHistory.length > 100) {
            this.portfolioHistory.shift();
        }
    }

    buyInsurance() {
        if (this.insurance) {
            this.showNotification('Você já possui seguro ativo', 'info');
            return;
        }
        
        const cost = 1000;
        if (this.balance >= cost) {
            this.balance -= cost;
            this.insurance = true;
            this.insuranceCost = cost;
            this.insuranceDays = 30;
            this.showNotification('Seguro ativado por 30 dias', 'success');
            this.updateUI();
        } else {
            this.showNotification('Saldo insuficiente para comprar seguro', 'error');
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('toggle-sound');
        if (soundBtn) {
            soundBtn.textContent = this.soundEnabled ? '🔊 Som' : '🔇 Mudo';
        }
        this.showNotification(this.soundEnabled ? 'Som ativado' : 'Som desativado', 'info');
        this.saveGameState();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark', this.theme === 'dark');
        
        const themeBtn = document.getElementById('toggle-theme');
        if (themeBtn) {
            themeBtn.textContent = this.theme === 'light' ? '🌙 Tema' : '☀️ Tema';
        }
        
        this.showNotification(`Tema alterado para ${this.theme === 'light' ? 'claro' : 'escuro'}`, 'info');
        this.saveGameState();
    }

    toggleFavorites() {
        const symbol = document.getElementById('crypto-select').value;
        if (!symbol) {
            this.showNotification('Selecione uma criptomoeda primeiro', 'info');
            return;
        }
        
        const index = this.favoriteCryptos.indexOf(symbol);
        if (index > -1) {
            this.favoriteCryptos.splice(index, 1);
            this.showNotification(`${symbol} removido dos favoritos`, 'info');
        } else {
            this.favoriteCryptos.push(symbol);
            this.showNotification(`${symbol} adicionado aos favoritos`, 'success');
        }
        
        this.saveGameState();
    }

    updateMarketSentiment() {
        const totalChange = this.cryptos.reduce((sum, crypto) => {
            return sum + (crypto.trend === 'up' ? 1 : crypto.trend === 'down' ? -1 : 0);
        }, 0);
        
        if (totalChange > 3) {
            this.marketSentiment = 'bullish';
        } else if (totalChange < -3) {
            this.marketSentiment = 'bearish';
        } else {
            this.marketSentiment = 'neutral';
        }
    }

    getSentimentMultiplier() {
        switch (this.marketSentiment) {
            case 'bullish': return 1.2;
            case 'bearish': return 0.8;
            default: return 1.0;
        }
    }

    getSentimentEmoji() {
        switch (this.marketSentiment) {
            case 'bullish': return '📈';
            case 'bearish': return '📉';
            default: return '➡️';
        }
    }

    generateNews() {
        const newsTemplates = [
            'Regulamentação de criptomoedas avança em vários países',
            'Grande empresa anuncia adoção de blockchain',
            'Novo protocolo DeFi promete revolucionar o mercado',
            'Influenciadores discutem futuro das criptomoedas',
            'Banco central considera CBDC'
        ];
        
        if (this.news.length < 5) {
            const randomNews = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
            this.news.unshift({
                title: 'Notícia do Mercado',
                content: randomNews,
                day: this.day
            });
        }
    }

    updateNewsDisplay() {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;
        
        newsContainer.innerHTML = '';
        
        this.news.slice(0, 3).forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-title">${news.title}</div>
                <div class="news-content">${news.content}</div>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    startSpecialEvents() {
        setInterval(() => {
            if (Math.random() < 0.1 && this.day > 10) {
                this.triggerSpecialEvent();
            }
        }, 60000);
    }

    triggerSpecialEvent() {
        const events = [
            { name: 'Pump and Dump', effect: 'pump', description: 'Preços sobem rapidamente!' },
            { name: 'Market Crash', effect: 'crash', description: 'Mercado em queda livre!' },
            { name: 'FOMO', effect: 'fomo', description: 'Medo de perder oportunidade!' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.applyEventEffect(event);
        
        this.specialEvents.unshift({
            name: event.name,
            description: event.description,
            day: this.day
        });
        
        if (this.specialEvents.length > 5) {
            this.specialEvents.pop();
        }
        
        this.showNotification(`⚡ ${event.name}: ${event.description}`, 'info');
    }

    applyEventEffect(event) {
        this.cryptos.forEach(crypto => {
            let multiplier = 1;
            switch (event.effect) {
                case 'pump':
                    multiplier = 1 + (Math.random() * 0.3);
                    break;
                case 'crash':
                    multiplier = 1 - (Math.random() * 0.3);
                    break;
                case 'fomo':
                    multiplier = 1 + (Math.random() * 0.2);
                    break;
            }
            crypto.price *= multiplier;
        });
    }

    updateEventsDisplay() {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;
        
        eventsContainer.innerHTML = '';
        
        this.specialEvents.slice(0, 3).forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <div class="event-title">${event.name}</div>
                <div class="event-content">${event.description}</div>
            `;
            eventsContainer.appendChild(eventItem);
        });
    }

    updateAchievementsDisplay() {
        const achievementsContainer = document.getElementById('achievements-container');
        if (!achievementsContainer) return;
        
        achievementsContainer.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = 'achievement-item';
            achievementItem.innerHTML = `
                <div class="achievement-icon">🏆</div>
                <div class="achievement-info">
                    <div class="achievement-name">${this.getAchievementName(achievement)}</div>
                    <div class="achievement-description">Conquista desbloqueada!</div>
                </div>
            `;
            achievementsContainer.appendChild(achievementItem);
        });
    }

    updateAdvancedStats() {
        const advancedStats = document.getElementById('advanced-stats');
        if (!advancedStats) return;
        
        advancedStats.innerHTML = '';
        
        const stats = [
            { label: 'Total de Trades', value: this.totalTrades },
            { label: 'Trades Lucrativos', value: this.successfulTrades },
            { label: 'Taxa de Sucesso', value: `${((this.successfulTrades / this.totalTrades) * 100 || 0).toFixed(1)}%` },
            { label: 'Lucro Total', value: `$${this.totalProfit.toFixed(2)}` },
            { label: 'Nível de Risco', value: this.riskLevel }
        ];
        
        stats.forEach(stat => {
            const statRow = document.createElement('div');
            statRow.className = 'stat-row';
            statRow.innerHTML = `
                <span>${stat.label}</span>
                <span>${stat.value}</span>
            `;
            advancedStats.appendChild(statRow);
        });
    }

    updateMissionsDisplay() {
        const missionsContainer = document.getElementById('missions-container');
        if (!missionsContainer) return;
        
        missionsContainer.innerHTML = '';
        
        this.missions.forEach(mission => {
            const missionItem = document.createElement('div');
            missionItem.className = 'mission-item';
            
            const progress = Math.min((mission.current / mission.target) * 100, 100);
            const isCompleted = mission.completed || mission.current >= mission.target;
            
            missionItem.innerHTML = `
                <div>${mission.name}</div>
                <div>${mission.current}/${mission.target}</div>
                <div class="mission-progress">
                    <div class="mission-progress-bar" style="width: ${progress}%"></div>
                </div>
                ${isCompleted ? '✅' : '⏳'}
            `;
            
            missionsContainer.appendChild(missionItem);
        });
    }

    updateLeaderboardDisplay() {
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (!leaderboardContainer) return;
        
        leaderboardContainer.innerHTML = '';
        
        this.leaderboard.forEach((player, index) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            leaderboardItem.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-name">${player.name}</div>
                <div class="leaderboard-score">$${player.score.toLocaleString()}</div>
            `;
            leaderboardContainer.appendChild(leaderboardItem);
        });
    }

    updateGameInfo() {
        document.getElementById('streak-display').textContent = this.streak;
        document.getElementById('max-streak-display').textContent = this.maxStreak;
        document.getElementById('daily-bonus-display').textContent = `$${this.dailyBonus}`;
        document.getElementById('insurance-status').textContent = this.insurance ? `Ativo (${this.insuranceDays} dias)` : 'Inativo';
    }

    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        if (!notifications) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    saveGameState() {
        const gameState = {
            balance: this.balance,
            portfolio: this.portfolio,
            day: this.day,
            level: this.level,
            experience: this.experience,
            achievements: this.achievements,
            streak: this.streak,
            maxStreak: this.maxStreak,
            insurance: this.insurance,
            insuranceDays: this.insuranceDays,
            favoriteCryptos: this.favoriteCryptos,
            soundEnabled: this.soundEnabled,
            theme: this.theme,
            timeSpeed: this.timeSpeed,
            autoAdvance: this.autoAdvance
        };
        
        localStorage.setItem('cryptoEmpireState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('cryptoEmpireState');
        if (savedState) {
            try {
                const gameState = JSON.parse(savedState);
                
                this.balance = gameState.balance || 10000;
                this.portfolio = gameState.portfolio || {};
                this.day = gameState.day || 1;
                this.level = gameState.level || 1;
                this.experience = gameState.experience || 0;
                this.achievements = gameState.achievements || [];
                this.streak = gameState.streak || 0;
                this.maxStreak = gameState.maxStreak || 0;
                this.insurance = gameState.insurance || false;
                this.insuranceDays = gameState.insuranceDays || 0;
                this.favoriteCryptos = gameState.favoriteCryptos || [];
                this.soundEnabled = gameState.soundEnabled !== undefined ? gameState.soundEnabled : true;
                this.theme = gameState.theme || 'light';
                this.timeSpeed = gameState.timeSpeed || 1;
                this.autoAdvance = gameState.autoAdvance !== undefined ? gameState.autoAdvance : true;
                
                if (this.theme === 'dark') {
                    document.body.classList.add('dark');
                }
                
                this.showNotification('Jogo carregado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao carregar estado do jogo:', error);
            }
        }
    }

    resetGame() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos.')) {
            localStorage.removeItem('cryptoEmpireState');
            location.reload();
        }
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CryptoGame();
    
    // Adicionar listener para reset
    document.getElementById('reset-game').addEventListener('click', () => {
        window.game.resetGame();
    });
    
    // Auto-save a cada 30 segundos
    setInterval(() => {
        if (window.game) {
            window.game.saveGameState();
        }
    }, 30000);
});
