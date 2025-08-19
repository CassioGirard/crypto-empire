# Crypto Empire - Simulador de Mercado

Um jogo de simulação de mercado de criptomoedas desenvolvido em HTML, CSS e JavaScript com funcionalidades avançadas e layout otimizado para mobile.

## 🎯 Características Principais

- **Simulação Realista**: Mercado de criptomoedas com preços dinâmicos e volatilidade
- **Sistema de Portfolio**: Compre e venda criptomoedas com cálculo de lucros
- **Sistema de Conquistas**: 10 conquistas desbloqueáveis com recompensas
- **Missões Diárias**: 4 missões com progresso e recompensas
- **Eventos Especiais**: Eventos que afetam o mercado dinamicamente
- **Notícias do Mercado**: Sistema de notícias que influencia preços
- **Sistema de Ranking**: Leaderboard global com posicionamento
- **Layout Responsivo**: Otimizado para mobile (390x844) e desktop
- **Persistência**: Auto-save e carregamento de progresso

## 🆕 Novas Funcionalidades Implementadas

### 🎯 Sistema de Missões
- **Missões Diárias**: Objetivos específicos para cada dia
- **Progresso Visual**: Barras de progresso para acompanhar objetivos
- **Recompensas**: Dinheiro e XP por missões completadas
- **Tipos**: Lucro diário, compra na baixa, venda na alta, diversificação

### 🏆 Sistema de Conquistas Expandido
- **10 Conquistas**: Desbloqueie todas as conquistas disponíveis
- **Novas Conquistas**:
  - 🎯 **Mestre da Sequência**: 10 dias consecutivos de lucro
  - 🎲 **Tomador de Risco**: Use nível de risco máximo por 5 dias
  - ✅ **Completador de Missões**: Complete 20 missões
  - 📈 **Seguidor de Tendências**: Compre 3 criptos em alta

### 📊 Sistema de Ranking (Leaderboard)
- **Ranking Global**: Compare seu desempenho com outros jogadores
- **Posicionamento**: Veja sua posição atual no ranking
- **Estatísticas**: Saldo, nível e lucro total dos jogadores
- **Medalhas**: 🥇🥈🥉 para os 3 primeiros lugares

### 🛡️ Sistema de Seguro
- **Proteção**: Ative seguro por $1000 por 7 dias
- **Benefícios**: Proteção contra perdas durante o período
- **Status**: Acompanhe dias restantes do seguro
- **Estratégia**: Use em momentos de alta volatilidade

### ⭐ Sistema de Favoritos
- **Criptos Favoritas**: Marque suas criptomoedas preferidas
- **Identificação Visual**: Estrelas para identificar favoritos
- **Gestão**: Adicione/remova favoritos facilmente

### 🎨 Sistema de Temas
- **Tema Claro**: Interface padrão com cores vibrantes
- **Tema Escuro**: Modo noturno para melhor experiência
- **Alternância**: Mude entre temas com um clique
- **Persistência**: Tema salvo automaticamente

### 🔊 Sistema de Som
- **Controle de Áudio**: Ative/desative sons do jogo
- **Notificações Sonoras**: Feedback auditivo para ações
- **Preferências**: Configuração salva automaticamente

### 📈 Sistema de Sequências (Streaks)
- **Sequência de Lucros**: Dias consecutivos com lucro
- **Bônus Diários**: Recompensas baseadas na sequência
- **Recordes**: Acompanhe sua sequência máxima
- **Conquistas**: Desbloqueie conquistas por sequências

### 💰 Sistema de Taxas
- **Taxa de Trading**: 0.1% por operação (compra/venda)
- **Realismo**: Simula custos reais de trading
- **Estratégia**: Considere taxas em suas operações

### 📊 Histórico do Portfolio
- **Rastreamento**: Histórico de 100 dias de operações
- **Análise**: Visualize evolução do seu portfolio
- **Métricas**: Saldo, valor do portfolio e valor total
- **Persistência**: Dados salvos automaticamente

### 🚀 Criptomoedas Expandidas
- **15 Criptomoedas**: Lista expandida com mais opções
- **Novas Categorias**: Meme coins, pagamentos, interoperabilidade
- **Tendências**: Indicadores visuais de tendência (📈📉➡️)
- **Volatilidade**: Diferentes níveis de risco por cripto

## 🎮 Como Jogar

### **Controles Básicos**
1. **Próximo Dia**: Avance a simulação manualmente
2. **Pausar**: Pare a simulação automática
3. **Nível de Risco**: Ajuste de 1-5 para afetar volatilidade
4. **Comprar/Vender**: Execute operações de trading

### **Sistema de Missões**
- Complete missões diárias para ganhar recompensas
- Acompanhe progresso através das barras visuais
- Missões incluem objetivos de lucro, diversificação e timing

### **Estratégias Avançadas**
- Use o sistema de seguro em momentos de alta volatilidade
- Mantenha sequências de lucro para bônus diários
- Diversifique seu portfolio para conquistas especiais
- Acompanhe tendências de mercado para timing ideal

## 🎨 Design System

### **Cores e Temas**
- **Primária**: Gradiente azul-roxo (#667eea → #764ba2)
- **Secundária**: Gradiente rosa-vermelho (#f093fb → #f5576c)
- **Sucesso**: Gradiente azul (#4facfe → #00f2fe)
- **Perigo**: Gradiente rosa-amarelo (#fa709a → #fee140)
- **Tema Escuro**: Modo noturno com cores adaptadas

### **Tipografia e Espaçamento**
- **Fonte**: Segoe UI com fallbacks otimizados
- **Hierarquia**: Tamanhos adaptados para mobile e desktop
- **Espaçamento**: Sistema consistente de gaps e padding
- **Legibilidade**: Contraste otimizado para todas as resoluções

## 📱 Responsividade

### **Breakpoints**
- **Mobile**: ≤390px (otimizado para iPhone 12 Pro)
- **Tablet**: 391px - 1199px
- **Desktop**: ≥1200px

### **Adaptações Mobile**
- Layout vertical empilhado para melhor navegação
- Header compacto com todas as estatísticas visíveis
- Botões otimizados para touch (44px mínimo)
- Scroll suave com `-webkit-overflow-scrolling: touch`

### **Adaptações Desktop**
- Layout em grid 2x4 para melhor aproveitamento
- Header horizontal com estatísticas lado a lado
- Elementos organizados em colunas paralelas
- Hover effects e interações avançadas

## 🔧 Tecnologias e Arquitetura

### **Frontend**
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, Media Queries, Animations
- **JavaScript ES6+**: Classes, Arrow Functions, Template Literals

### **Funcionalidades**
- **Local Storage**: Persistência de dados do jogo
- **Auto-save**: Salvamento automático a cada 30 segundos
- **Event System**: Sistema de eventos para interações
- **State Management**: Gerenciamento de estado centralizado

### **Performance**
- **Lazy Loading**: Carregamento sob demanda de elementos
- **Debouncing**: Otimização de eventos de scroll e resize
- **Memory Management**: Limpeza automática de dados antigos
- **Smooth Animations**: Transições suaves com CSS e JavaScript

## 🚀 Funcionalidades Avançadas

### **Sistema de Eventos**
- **Eventos Aleatórios**: Halving, forks, regulamentações
- **Efeitos no Mercado**: Impacto nos preços das criptos
- **Notificações**: Alertas para eventos importantes
- **Histórico**: Registro dos últimos 5 eventos

### **Análise de Mercado**
- **Sentimento**: Bullish, Bearish, Neutral
- **Tendências**: Indicadores visuais de direção
- **Volatilidade**: Diferentes níveis por criptomoeda
- **Market Cap**: Simulação realista de capitalização

### **Sistema de Progresso**
- **Níveis**: Sistema de XP com recompensas
- **Bônus**: Recompensas por level up
- **Conquistas**: Objetivos de longo prazo
- **Missões**: Objetivos diários e semanais

## 📁 Estrutura do Projeto

```
game/
├── index.html          # Estrutura principal com novas seções
├── style.css           # Estilos responsivos e temas
├── script.js           # Lógica do jogo e funcionalidades
└── README.md           # Documentação completa
```

## 🎯 Próximas Melhorias

- [ ] **Modo Multiplayer**: Competição em tempo real
- [ ] **Gráficos Interativos**: Charts para análise técnica
- [ ] **Sistema de Notificações Push**: Alertas avançados
- [ ] **Modo Offline**: Funcionamento sem internet
- [ ] **PWA**: Progressive Web App com instalação
- [ ] **Mais Criptomoedas**: Expansão da lista disponível
- [ ] **Sistema de Torneios**: Competições temporárias
- [ ] **Integração com APIs**: Dados reais de mercado

## 🏆 Conquistas Disponíveis

1. **Primeiro Trade** - Execute sua primeira compra
2. **Fazedor de Lucros** - Tenha um lucro de $1000
3. **Diversificador** - Possua 5 criptomoedas diferentes
4. **Milionário** - Alcance $1,000,000
5. **Day Trader** - Execute 50 trades
6. **HODLer** - Mantenha uma cripto por 30 dias
7. **Mestre da Sequência** - 10 dias consecutivos de lucro
8. **Tomador de Risco** - Use nível de risco máximo por 5 dias
9. **Completador de Missões** - Complete 20 missões
10. **Seguidor de Tendências** - Compre 3 criptos em tendência de alta

## 🎮 Como Testar

1. **Clone o repositório**
2. **Abra `index.html`** no navegador
3. **Use as ferramentas de desenvolvedor** para simular 390x844
4. **Interaja com todas as funcionalidades**:
   - Complete missões diárias
   - Desbloqueie conquistas
   - Use o sistema de seguro
   - Acompanhe o leaderboard
   - Teste temas e configurações

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**Desenvolvido com ❤️ para otimização mobile e funcionalidades avançadas**
