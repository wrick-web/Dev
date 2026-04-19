import { PrismaClient } from '@prisma/client'

/**
 * Singleton for Prisma Client to prevent multiple instances in development.
 * This ensures efficient database connection reuse, especially important in Next.js
 * where hot reloading can create multiple instances in dev mode.
 * 
 * See: https://www.prisma.io/docs/reference/api-reference/prisma-client-constructor#prismaclient
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
