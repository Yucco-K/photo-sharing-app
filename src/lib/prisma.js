// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const test = await prisma.$queryRaw`SELECT 1`;
  console.log(test);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

export default prisma;
