import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton
 * 
 * Features:
 * - Singleton pattern to prevent multiple instances
 * - Connection pooling optimized for serverless
 * - Conditional logging based on environment
 * 
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Logging configuration
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    
    // Datasource configuration (connection pooling is handled by Prisma connection string)
    // For optimal pooling, use connection string parameters:
    // ?connection_limit=10&pool_timeout=10
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

// In development, preserve the client across hot reloads
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

