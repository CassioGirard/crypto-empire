# 🚀 Crypto Real Simulator

Um simulador comunitário de mercado de criptomoeda fictícia **$REAL** em tempo real, onde cada jogador pode comprar e vender moedas, afetando o preço global do mercado.

## ✨ Características

- **Preço dinâmico** baseado em oferta e demanda em tempo real
- **Interface moderna** com React + TailwindCSS + Framer Motion
- **Comunicação em tempo real** via Socket.io
- **Sistema de ranking** global dos melhores traders
- **Eventos de mercado** aleatórios que afetam todos os jogadores
- **Histórico completo** de trades e preços
- **Responsivo** para desktop e mobile
- **Persistência** de dados via MongoDB

## 🏗️ Arquitetura

### Frontend
- **React 18** com hooks e context API
- **TailwindCSS** para estilização
- **Framer Motion** para animações
- **Recharts** para gráficos de preço
- **Socket.io Client** para comunicação em tempo real

### Backend
- **Node.js** com Express
- **Socket.io** para comunicação em tempo real
- **MongoDB** com Mongoose para persistência
- **API REST** para operações CRUD

### Banco de Dados
- **MongoDB** para armazenar jogadores e dados de mercado
- **Schemas** para Player, Market e histórico de trades

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ 
- MongoDB 5+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd crypto-empire
```

### 2. Instale as dependências
```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do servidor
cd server
npm install

# Instalar dependências do cliente
cd ../client
npm install

# Voltar para a raiz
cd ..
```

### 3. Configure o MongoDB
Certifique-se de que o MongoDB está rodando localmente ou configure a variável de ambiente:

```bash
# Copie o arquivo de exemplo
cp server/env.example server/.env

# Edite o arquivo .env com sua configuração
MONGODB_URI=mongodb://localhost:27017/crypto-real
PORT=5000
NODE_ENV=development
```

### 4. Inicie o projeto
```bash
# Desenvolvimento (inicia servidor + cliente simultaneamente)
npm run dev

# Ou inicie separadamente:
npm run server    # Inicia o backend na porta 5000
npm run client    # Inicia o frontend na porta 3000
```

## 🎮 Como Jogar

### 1. **Entrar no Mercado**
- Digite seu nome (sem senha)
- Clique em "Entrar no Mercado"
- Você receberá 10.000 BRL fictícios para começar

### 2. **Fazer Trades**
- **Comprar $REAL**: Use seu saldo BRL para comprar moedas $REAL
- **Vender $REAL**: Venda suas moedas $REAL por BRL
- Cada trade afeta o preço global da moeda

### 3. **Mecânica de Preço**
- **Oferta e Demanda**: Compras aumentam o preço, vendas diminuem
- **Fator de Elasticidade**: 0.001 (ajustável)
- **Preço Mínimo**: 0.01 BRL
- **Eventos Aleatórios**: Notícias que afetam o preço

### 4. **Objetivo**
- Acumular o maior patrimônio total (BRL + $REAL convertido)
- Competir no ranking global
- Sobreviver a crashes e aproveitar bull runs

## 📊 Funcionalidades

### Mercado Global
- Preço atual em tempo real
- Gráfico histórico de preços
- Volume de transações
- Estatísticas do mercado

### Carteira do Jogador
- Saldo em BRL e $REAL
- Patrimônio total
- Histórico de trades
- Interface de compra/venda

### Ranking Global
- Top 20 traders
- Estatísticas por jogador
- Destaque para top 3
- Atualização em tempo real

### Sistema de Notícias
- Eventos automáticos de mercado
- Notícias importantes destacadas
- Histórico de eventos
- Impacto no preço

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/crypto-real
PORT=5000
NODE_ENV=development
```

### Parâmetros do Mercado
```javascript
// server/index.js
const factorElasticidade = 0.001;        // Sensibilidade do preço
const marketEvents = [                   // Eventos de mercado
  { message: "Hacker rouba exchange!", impact: -0.20, probability: 0.05 },
  { message: "Nova parceria anunciada!", impact: 0.15, probability: 0.08 },
  // ... mais eventos
];
```

### Personalização de Estilo
```css
/* client/src/index.css */
:root {
  --crypto-green: #10B981;
  --crypto-red: #EF4444;
  --crypto-blue: #3B82F6;
  --crypto-dark: #1F2937;
}
```

## 🚀 Próximos Passos

### Funcionalidades Planejadas
- [ ] **Sistema de Guildas**: Grupos de traders
- [ ] **Moedas Alternativas**: Novas criptomoedas
- [ ] **Sistema PvP**: Desafios entre jogadores
- [ ] **Chat Global**: Comunicação em tempo real
- [ ] **Conquistas**: Sistema de badges e recompensas
- [ ] **Taxas de Transação**: Custos por trade
- [ ] **Day/Night Cycle**: Variação por horário
- [ ] **Boatos de Mercado**: Informações falsas

### Melhorias Técnicas
- [ ] **Testes Automatizados**: Jest + Testing Library
- [ ] **CI/CD**: GitHub Actions
- [ ] **Docker**: Containerização
- [ ] **Redis**: Cache em memória
- [ ] **WebSocket Clustering**: Escalabilidade
- [ ] **Rate Limiting**: Proteção contra spam

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
crypto-empire/
├── server/                 # Backend Node.js
│   ├── models/            # Schemas MongoDB
│   ├── routes/            # API REST
│   ├── index.js           # Servidor principal
│   └── package.json
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Context API
│   │   ├── App.js         # App principal
│   │   └── index.js       # Entry point
│   └── package.json
├── package.json            # Scripts principais
└── README.md
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento (servidor + cliente)
npm run server       # Apenas backend
npm run client       # Apenas frontend
npm run build        # Build de produção
npm run install-all  # Instala todas as dependências
```

### Tecnologias Utilizadas
- **Frontend**: React, TailwindCSS, Framer Motion, Recharts
- **Backend**: Node.js, Express, Socket.io, Mongoose
- **Banco**: MongoDB
- **Dev Tools**: Nodemon, Concurrently

## 🐛 Solução de Problemas

### Erro de Conexão MongoDB
```bash
# Verificar se o MongoDB está rodando
mongod --version
# Iniciar MongoDB
mongod
```

### Porta já em uso
```bash
# Verificar processos nas portas
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Matar processo específico
taskkill /PID <PID> /F
```

### Dependências não encontradas
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: Use o GitHub Issues para reportar bugs
- **Discussions**: Use o GitHub Discussions para perguntas
- **Email**: [seu-email@exemplo.com]

---

**Crypto Real Simulator** - Transformando o mercado de criptomoedas em um jogo emocionante! 🎯💰
