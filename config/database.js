const mongoose = require('mongoose');

// Connection caching for serverless functions
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if promise doesn't exist
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shri-hospital', opts)
      .then((mongoose) => {
        console.log('MongoDB Connected Successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB Connection Error:', error.message);
        // Don't exit in serverless environment
        if (process.env.NODE_ENV !== 'production') {
          process.exit(1);
        }
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
