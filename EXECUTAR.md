# 🚀 Como Executar o Crypto Real Simulator

## ⚡ Execução Rápida

### 1. **Instalar Dependências**
```bash
npm run install-all
```

### 2. **Iniciar MongoDB**
```bash
# Terminal 1 - Iniciar MongoDB
mongod
```

### 3. **Executar o Projeto**
```bash
# Terminal 2 - Iniciar servidor + cliente
npm run dev
```

### 4. **Acessar o Jogo**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🔧 Execução Detalhada

### **Passo 1: Verificar Pré-requisitos**
```bash
# Verificar Node.js
node --version  # Deve ser 16+

# Verificar npm
npm --version   # Deve ser 8+

# Verificar MongoDB
mongod --version  # Deve ser 5+
```

### **Passo 2: Configurar Ambiente**
```bash
# Copiar arquivo de configuração
cp server/env.example server/.env

# O arquivo .env será criado com configurações padrão
# Você pode editá-lo se necessário
```

### **Passo 3: Instalar Dependências**
```bash
# Instalar tudo de uma vez
npm run install-all

# Ou instalar separadamente:
npm install                    # Dependências principais
cd server && npm install      # Dependências do servidor
cd ../client && npm install   # Dependências do cliente
cd ..                         # Voltar para raiz
```

### **Passo 4: Iniciar Serviços**

#### **Terminal 1: MongoDB**
```bash
mongod
# Aguardar mensagem: "waiting for connections on port 27017"
```

#### **Terminal 2: Servidor + Cliente**
```bash
npm run dev
# Isso iniciará ambos simultaneamente
```

### **Passo 5: Verificar Funcionamento**

#### **✅ Indicadores de Sucesso**
1. **Terminal MongoDB**: "waiting for connections on port 27017"
2. **Terminal Servidor**: "✅ MongoDB conectado: localhost"
3. **Terminal Servidor**: "Servidor rodando na porta 5000"
4. **Terminal Cliente**: "Compiled successfully!"
5. **Navegador**: Tela de login do Crypto Real Simulator

#### **❌ Possíveis Erros e Soluções**

**Erro: "MongoDB não conecta"**
```bash
# Solução 1: Verificar se MongoDB está rodando
mongod --version

# Solução 2: Iniciar MongoDB
mongod

# Solução 3: Usar MongoDB Atlas (nuvem)
# Editar server/.env com sua URI
```

**Erro: "Porta já em uso"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Erro: "Dependências não encontradas"**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
cd server && rm -rf node_modules package-lock.json
cd ../client && rm -rf node_modules package-lock.json
cd ..
npm run install-all
```

## 🎮 Primeiro Uso

### **1. Acessar o Jogo**
- Abra http://localhost:3000 no navegador
- Você verá a tela de login do Crypto Real Simulator

### **2. Criar Conta**
- Digite seu nome (ex: "Trader123")
- Clique em "Entrar no Mercado"
- Você receberá 10.000 BRL para começar

### **3. Fazer Primeiro Trade**
- Vá para a aba "Carteira"
- Digite uma quantidade (ex: 100)
- Clique em "Selecionar Compra"
- Clique em "Comprar 100.00 $REAL"

### **4. Explorar Funcionalidades**
- **Mercado**: Veja preços e gráficos em tempo real
- **Carteira**: Gerencie seus trades
- **Ranking**: Compare com outros jogadores
- **Notícias**: Acompanhe eventos do mercado

## 🔍 Monitoramento

### **Logs do Servidor**
```bash
# Terminal do servidor mostrará:
✅ MongoDB conectado: localhost
✅ Índices do banco criados com sucesso
Servidor rodando na porta 5000
Crypto Real Simulator iniciado!
Novo jogador conectado: [socket-id]
Preço atualizado: 1.001 BRL - Compra de 100 $REAL
```

### **Logs do Cliente**
```bash
# Console do navegador mostrará:
🔌 Conectado ao servidor
Conectado ao servidor
```

### **Status do Banco**
```bash
# MongoDB Compass ou terminal
# Verificar coleções: players, markets
# Verificar documentos criados
```

## 🛠️ Comandos Úteis

### **Desenvolvimento**
```bash
npm run dev          # Servidor + Cliente
npm run server       # Apenas Backend
npm run client       # Apenas Frontend
```

### **Produção**
```bash
npm run build        # Build do cliente
npm start            # Iniciar servidor de produção
```

### **Manutenção**
```bash
npm run install-all  # Reinstalar dependências
npm audit fix        # Corrigir vulnerabilidades
```

## 📱 Testando em Diferentes Dispositivos

### **Desktop (Chrome DevTools)**
1. F12 → Device Toolbar
2. Selecionar dispositivo (iPhone, Android, etc.)
3. Testar responsividade

### **Mobile Real**
1. Descobrir IP da máquina: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Acessar `http://[SEU-IP]:3000` no celular
3. Testar funcionalidades touch

## 🚀 Deploy

### **Local com PM2**
```bash
# Instalar PM2
npm install -g pm2

# Build de produção
npm run build

# Iniciar com PM2
pm2 start server/index.js --name crypto-real
pm2 startup
pm2 save
```

### **Docker (Futuro)**
```bash
# Build da imagem
docker build -t crypto-real .

# Executar container
docker run -p 3000:3000 -p 5000:5000 crypto-real
```

## 🎯 Próximos Passos

### **Funcionalidades para Implementar**
- [ ] Sistema de conquistas
- [ ] Chat global
- [ ] Sistema de guildas
- [ ] Mais moedas
- [ ] Sistema PvP

### **Melhorias Técnicas**
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Cache Redis
- [ ] Load balancing

---

## 🎉 **Parabéns! Seu Crypto Real Simulator está funcionando!**

**Agora você pode:**
- 🎮 Jogar com outros usuários
- 📈 Ver preços em tempo real
- 💰 Fazer trades de $REAL
- 🏆 Competir no ranking global
- 📰 Acompanhar notícias do mercado

**Divirta-se explorando o mundo das criptomoedas! 🚀💰**
