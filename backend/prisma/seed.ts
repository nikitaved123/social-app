import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Тестовый Пользователь',
      password: bcrypt.hashSync('123456', 8),
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  })

  console.log('Тестовый пользователь создан:', testUser.email)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })