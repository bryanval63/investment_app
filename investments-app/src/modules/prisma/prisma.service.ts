import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // Si DATABASE_URL n'est pas défini (comme sur ton PC de dev), on prend le fichier local par défaut
    const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    super({ adapter });
  }
}
