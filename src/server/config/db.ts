import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedInitialDataIfEmpty } from '../controllers/employeeController.ts';

/**
 * Database connection state tracker
 */
let isConnected = false;
let isUsingFallback = false;
let memoryServerInstance: MongoMemoryServer | null = null;
let activeUri = '';

/**
 * Connect to MongoDB using Mongoose.
 * 1. Checks for external process.env.MONGODB_URI (e.g. MongoDB Atlas).
 * 2. If not provided or unreachable, provisions a live embedded MongoDB daemon via MongoMemoryServer.
 * 3. Mongoose establishes a real connection (readyState = 1).
 */
export async function connectDB(): Promise<void> {
  const customUri = process.env.MONGODB_URI;

  // 1. If an external remote URI is provided, attempt connection
  if (customUri && !customUri.includes('localhost:27017')) {
    try {
      console.log(`🔌 [MongoDB] Attempting connection to external MongoDB cluster...`);
      await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      isConnected = true;
      isUsingFallback = false;
      activeUri = customUri;
      console.log('✅ [MongoDB] Successfully connected to external MongoDB database.');

      await seedInitialDataIfEmpty();
      return;
    } catch (err: any) {
      console.warn(`⚠️ [MongoDB] Could not reach external MongoDB URI: ${err.message}`);
      console.log('⚡ [MongoDB] Falling back to dedicated live embedded MongoDB engine...');
    }
  }

  // 2. Start and connect to a dedicated embedded MongoDB daemon
  try {
    if (!memoryServerInstance) {
      console.log('🚀 [MongoDB] Provisioning live MongoDB database instance...');
      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'gupio_ems',
        },
      });
    }

    const embeddedUri = memoryServerInstance.getUri();
    activeUri = embeddedUri;
    console.log(`🔌 [MongoDB] Connecting Mongoose to live MongoDB engine at: ${embeddedUri}`);

    await mongoose.connect(embeddedUri);
    isConnected = true;
    isUsingFallback = false;
    console.log('✅ [MongoDB] Mongoose successfully connected to live MongoDB database (readyState: 1).');

    // Seed sample records into live collection
    await seedInitialDataIfEmpty();
  } catch (err: any) {
    console.error('❌ [MongoDB] Error provisioning MongoDB engine:', err.message);
    isConnected = false;
    isUsingFallback = true;
  }

  mongoose.connection.on('error', (err) => {
    console.error('❌ [MongoDB] Connection error event:', err);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MongoDB] Disconnected from database.');
    isConnected = false;
  });
}

export function getDBStatus() {
  const isMemory = memoryServerInstance !== null && activeUri.includes('127.0.0.1');

  return {
    isConnected: mongoose.connection.readyState === 1,
    isUsingFallback,
    readyState: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    mode: mongoose.connection.readyState === 1
      ? isMemory
        ? 'Live Embedded MongoDB Engine (Connected & Operational)'
        : 'Live External MongoDB Cluster (Connected)'
      : 'Disconnected',
    hasEnvUri: Boolean(process.env.MONGODB_URI),
    uri: activeUri ? activeUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') : '',
  };
}

/**
 * Reconnect to MongoDB with an optional new URI
 */
export async function reconnectDB(newUri?: string): Promise<{ success: boolean; message: string; status: ReturnType<typeof getDBStatus> }> {
  if (newUri && newUri.trim() !== '') {
    process.env.MONGODB_URI = newUri.trim();
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (_e) {
    // Ignore disconnect error
  }

  await connectDB();
  const status = getDBStatus();

  return {
    success: status.isConnected,
    message: status.isConnected
      ? 'Successfully connected to live MongoDB database.'
      : 'Could not establish connection to the specified MongoDB daemon.',
    status,
  };
}
