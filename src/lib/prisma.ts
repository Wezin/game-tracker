import { PrismaClient } from "@prisma/client"; // import PrismaClient, prisma's typed DB connector class
import { PrismaPg } from "@prisma/adapter-pg"; //import Postgres adapter (Needed in prisma V7)


const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient}; //store prisma client

const adapter = new PrismaPg({ //Create instance of postgres adapter so prisma can talk to is
    connectionString: process.env.DATABASE_URL!, //Read database url from .env file

})

export const prisma = 
    globalForPrisma.prisma ??
    new PrismaClient ({
        adapter,
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 