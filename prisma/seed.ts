import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 10);
  await prisma.employee.upsert({
    where: { email: 'emad@test.com' },
    update: {},
    create: {
      name: 'emad',
      email: 'emad@test.com',
      passwordHash: passwordHash,
      groupType: 'HR',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
