import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalThis = global as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
