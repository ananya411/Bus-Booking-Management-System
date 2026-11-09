const mongoose = require('mongoose');

const connectDB = async (retryCount = 5, retryDelayMs = 3000) => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus-booking';

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[Database] Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt < retryCount) {
        console.log(`[Database] Retrying in ${retryDelayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      } else {
        console.error('[Database] All connection attempts exhausted.');
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        }
        throw error;
      }
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[Database] MongoDB connection closed.');
  } catch (error) {
    console.error(`[Database] Error disconnecting MongoDB: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
