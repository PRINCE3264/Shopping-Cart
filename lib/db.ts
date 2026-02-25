import prisma from "./prisma";

/**
 * connectDB is a no-op for Prisma as it handles connection pooling automatically,
 * but we keep the export for compatibility with existing imports.
 */
export const connectDB = async () => {
  // Prisma handles connections automatically.
  // We can optionally call prisma.$connect() but it's not strictly required.
  return prisma;
};
