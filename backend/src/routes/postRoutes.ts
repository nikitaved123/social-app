import { Router } from 'express'
import { getPosts, createPost, likePost, addComment } from '../controllers/postController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.get('/', getPosts)
router.post('/', authenticateToken, createPost)
router.post('/:id/like', authenticateToken, likePost)
router.post('/:id/comments', authenticateToken, addComment)

export default router