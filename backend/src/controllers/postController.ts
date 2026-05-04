import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { AuthRequest } from '../middleware/auth'

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        },
        comments: {
          include: {
            user: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        likes: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Исправлено: добавили тип для параметра post
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      likes: post.likes.length,
      comments: post.comments
    }))
    
    res.json(formattedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка загрузки постов' })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Неверный ID поста' })
    }
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        likes: true
      }
    })
    
    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' })
    }
    
    res.json({
      ...post,
      likes: post.likes.length
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка загрузки поста' })
  }
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, body } = req.body
    const userId = req.userId

    if (!title || !body) {
      return res.status(400).json({ error: 'Заголовок и текст обязательны' })
    }

    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' })
    }

    const post = await prisma.post.create({
      data: {
        title,
        body,
        userId: userId
      },
      include: {
        user: { 
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    res.status(201).json({
      ...post,
      likes: 0,
      comments: []
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка создания поста' })
  }
}

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string)
    const userId = req.userId!

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста' })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      const likesCount = await prisma.like.count({ where: { postId } })
      return res.json({ liked: false, likes: likesCount })
    } else {
      await prisma.like.create({
        data: { userId, postId }
      })
      const likesCount = await prisma.like.count({ where: { postId } })
      return res.json({ liked: true, likes: likesCount })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка при обработке лайка' })
  }
}

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string)
    const userId = req.userId!
    const { text } = req.body

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста' })
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Текст комментария обязателен' })
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        userId,
        postId
      },
      include: {
        user: { 
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка добавления комментария' })
  }
}

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string)
    const userId = req.userId!

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста' })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' })
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Нет прав на удаление' })
    }

    await prisma.post.delete({
      where: { id: postId }
    })

    res.json({ message: 'Пост удален' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка удаления поста' })
  }
}