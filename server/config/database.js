const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-real',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Criar índices para melhor performance
    await mongoose.connection.db.collection('players').createIndex({ name: 1 }, { unique: true });
    await mongoose.connection.db.collection('players').createIndex({ totalProfit: -1 });
    await mongoose.connection.db.collection('markets').createIndex({ createdAt: -1 });
    
    console.log('✅ Índices do banco criados com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
