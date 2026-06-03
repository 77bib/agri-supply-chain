import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

export class MongoConnectionError extends Error {
  public readonly originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super(message);
    this.name = 'MongoConnectionError';
    this.originalError = originalError;
  }
}

type MongoCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
  listenersRegistered: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongoCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const MAX_RETRY_ATTEMPTS = 4;
const BASE_RETRY_DELAY_MS = 250;
const MAX_RETRY_DELAY_MS = 4000;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI. Define it in .env.local or your deployment environment.');
}

function getMongoUri(): string {
  return MONGODB_URI;
}

const cached = globalThis.__mongooseCache ??= {
  conn: null,
  promise: null,
  listenersRegistered: false,
};

function maskMongoUri(uri: string): string {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function isRetryableMongoError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (error instanceof MongoConnectionError) {
    return isRetryableMongoError(error.originalError);
  }

  if (error instanceof Error) {
    const name = error.name;
    const message = error.message.toLowerCase();

    if (
      name === 'MongoNetworkError' ||
      name === 'MongoServerSelectionError' ||
      name === 'MongooseServerSelectionError' ||
      name === 'MongoTimeoutError'
    ) {
      return true;
    }

    return (
      message.includes('querysrv') ||
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('etimedout') ||
      message.includes('server selection timed out') ||
      message.includes('network error') ||
      message.includes('topology')
    );
  }

  return false;
}

function registerConnectionListeners(): void {
  if (cached.listenersRegistered) {
    return;
  }

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
    cached.conn = null;
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', formatError(error));
  });

  cached.listenersRegistered = true;
}

async function connectWithRetry(uri: string): Promise<Mongoose> {
  const options: ConnectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };

  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt += 1) {
    try {
      console.log(`🔗 Connecting to MongoDB Atlas (attempt ${attempt + 1}/${MAX_RETRY_ATTEMPTS})`);
      console.log(`🌐 MongoDB URI: ${maskMongoUri(uri)}`);

      const connected = await mongoose.connect(uri, options);
      cached.conn = connected;

      console.log('✅ MongoDB connection established:', connected.connection.db?.databaseName ?? 'unknown database');
      return connected;
    } catch (error) {
      lastError = error;

      console.error(`❌ MongoDB connection attempt ${attempt + 1} failed:`, formatError(error));

      if (attempt === MAX_RETRY_ATTEMPTS - 1 || !isRetryableMongoError(error)) {
        break;
      }

      const exponentialDelay = Math.min(BASE_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);
      const jitter = Math.floor(Math.random() * BASE_RETRY_DELAY_MS);
      const delay = exponentialDelay + jitter;

      console.warn(`⏳ Retrying MongoDB connection in ${delay}ms`);
      await sleep(delay);
    }
  }

  throw new MongoConnectionError(`MongoDB connection failed after ${MAX_RETRY_ATTEMPTS} attempts`, lastError);
}

async function dbConnect(): Promise<Mongoose> {
  const mongoUri = getMongoUri();

  registerConnectionListeners();

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  if (!cached.promise) {
    cached.promise = connectWithRetry(mongoUri)
      .then((connected) => {
        cached.conn = connected;
        return connected;
      })
      .catch((error) => {
        cached.conn = null;

        if (error instanceof MongoConnectionError) {
          throw error;
        }

        throw new MongoConnectionError('MongoDB connection failed', error);
      })
      .finally(() => {
        cached.promise = null;
      });
  }

  return cached.promise;
}

export default dbConnect;