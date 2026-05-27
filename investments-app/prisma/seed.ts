import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient({});

async function main() {}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
