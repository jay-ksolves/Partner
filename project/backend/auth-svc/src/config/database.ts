import mongoose from 'mongoose';
import logger from '../../../common/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_ATLAS_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_ATLAS_URI environment variable is required');
    }

    await mongoose.connect(mongoUri, {
      dbName: 'partner_platform',
    });

    logger.info('Connected to MongoDB Atlas');

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};