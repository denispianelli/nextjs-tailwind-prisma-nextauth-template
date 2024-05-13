import { PrismaClient } from '@prisma/client';
import { Return } from '@prisma/client/runtime/library';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | Return<typeof prismaClientSingleton>;
}

const db = global.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
}
