import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'your_secret_key_2024'

export interface AuthRequest extends Request {
  userId?: number
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number }
    req.userId = decoded.id
    next()
  } catch {
    return res.status(403).json({ error: 'Недействительный токен' })
  }
}