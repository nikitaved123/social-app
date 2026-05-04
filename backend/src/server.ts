import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import postRoutes from './routes/postRoutes'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API работает' })
})

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})