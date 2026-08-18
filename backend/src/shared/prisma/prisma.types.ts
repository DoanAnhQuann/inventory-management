import type { Prisma } from '../../../generated/prisma/client';
import type { PrismaService } from './prisma.service';

export type PrismaTransaction = Prisma.TransactionClient;
export type PrismaClientOrTx = PrismaService | PrismaTransaction;
