# 🚀 Instalação Rápida - Crypto Real Simulator

## ⚡ Setup em 5 minutos

### 1. **Pré-requisitos**
```bash
# Verificar se você tem Node.js
node --version  # Deve ser 16+

# Verificar se você tem MongoDB
mongod --version  # Deve ser 5+
```

### 2. **Instalar tudo de uma vez**
```bash
# Na raiz do projeto
npm run install-all
```

### 3. **Configurar MongoDB**
```bash
# Copiar arquivo de exemplo
cp server/env.example server/.env

# Editar o arquivo .env (opcional - usa configuração padrão)
# MONGODB_URI=mongodb://localhost:27017/crypto-real
# PORT=5000
# NODE_ENV=development
```

### 4. **Iniciar o projeto**
```bash
# Inicia servidor + cliente simultaneamente
npm run dev
```

### 5. **Acessar**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## 🔧 Comandos Úteis

```bash
# Desenvolvimento completo
npm run dev

# Apenas servidor
npm run server

# Apenas cliente  
npm run client

# Build de produção
npm run build

# Instalar dependências
npm run install-all
```

## 🐛 Problemas Comuns

### MongoDB não conecta
```bash
# Iniciar MongoDB
mongod

# Ou usar MongoDB Atlas (nuvem)
# Editar server/.env com sua URI
```

### Portas ocupadas
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependências quebradas
```bash
# Limpar tudo e reinstalar
rm -rf node_modules package-lock.json
cd server && rm -rf node_modules package-lock.json
cd ../client && rm -rf node_modules package-lock.json
cd ..
npm run install-all
```

## ✅ Verificação de Instalação

Se tudo estiver funcionando, você verá:

1. **Terminal**: "Servidor rodando na porta 5000"
2. **Navegador**: Tela de login do Crypto Real Simulator
3. **MongoDB**: Conexão estabelecida no terminal

## 🎮 Primeiro Uso

1. Digite seu nome na tela de login
2. Clique em "Entrar no Mercado"
3. Você receberá 10.000 BRL para começar
4. Faça seu primeiro trade de $REAL!

---

**🎯 Pronto! Agora você pode jogar Crypto Real Simulator!**
