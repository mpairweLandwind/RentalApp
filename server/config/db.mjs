/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.NODE_ENV === 'test') {
      throw error;
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
