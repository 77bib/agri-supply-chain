import mongoose from 'mongoose';

export class MongoConnectionError extends Error {
  public readonly originalError: unknown

  constructor(message: string, originalError: unknown) {
    super(message)
    this.name = 'MongoConnectionError'
    this.originalError = originalError
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongoose;

const RETRY_COOLDOWN_MS = 60_000;
let lastFailedAt: number | null = null;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Check if we already have a connection
  if (cached!.conn) {
    console.log('🔄 Using existing MongoDB connection');
    return cached!.conn;
  }

  if (!cached!.promise) {
    if (lastFailedAt && Date.now() - lastFailedAt < RETRY_COOLDOWN_MS) {
      throw new MongoConnectionError('MongoDB connection currently unavailable (cooldown active)', null)
    }

    console.log('🔗 Attempting to connect to MongoDB Atlas...');
    console.log('🌐 Connection URI pattern:', MONGODB_URI.replace(/\/\/[^:]*:[^@]*@/, '//***:***@'));
    
    const opts = {
      bufferCommands: true,              // Changed to true for Vercel
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,   // Increased to 30 seconds for Vercel
      socketTimeoutMS: 60000,            // Increased to 60 seconds
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 30000,           // Increased to 30 seconds
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      writeConcern: { w: 'majority' },
      maxConnecting: 2,
      family: 4                          // Use IPv4
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully to:', mongoose.connection.db?.databaseName);
      console.log('📊 Connection state:', mongoose.connection.readyState);
      lastFailedAt = null;
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed with error:', error.message);
      console.error('🔍 Error details:', {
        name: error.name,
        code: error.code,
        codeName: error.codeName
      });
      cached!.promise = null;
      lastFailedAt = Date.now();
      throw new MongoConnectionError('MongoDB connection failed', error);
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect; 