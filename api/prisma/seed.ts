import { PrismaService } from '../src/services/prisma.service';
import * as argon2 from 'argon2';

const prisma = new PrismaService();

async function main() {
  const users = [
    {
      email: 'admin@lumes.ai',
      password: 'admin123',
      name: 'Admin',
    },
    {
      email: 'joao@lumes.ai',
      password: '123456',
      name: 'João Silva',
    },
    {
      email: 'maria@lumes.ai',
      password: '123456',
      name: 'Maria Oliveira',
    },
  ];

  for (const user of users) {
    const hashedPassword = await argon2.hash(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: hashedPassword },
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
      },
    });
  }

  console.log('Seed completed: users created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
