import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'

const SECRET_KEY = 'your_secret_key_2024'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль минимум 6 символов' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email уже используется' })
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      }
    })

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' })

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ error: 'Пользователь не найден' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Неверный пароль' })
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}