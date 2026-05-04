const API_URL = 'http://localhost:3001/api/posts'

export const fetchPosts = async () => {
  const res = await fetch(`${API_URL}`)
  if (!res.ok) throw new Error('Ошибка загрузки постов')
  return res.json()
}

export const fetchPostById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error('Ошибка загрузки поста')
  return res.json()
}

export const createPost = async (post, token) => {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  })
  if (!res.ok) throw new Error('Ошибка создания поста')
  return res.json()
}

export const likePost = async (postId, token) => {
  const res = await fetch(`${API_URL}/${postId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Ошибка лайка')
  return res.json()
}

export const addComment = async (postId, text, token) => {
  const res = await fetch(`${API_URL}/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  })
  if (!res.ok) throw new Error('Ошибка добавления комментария')
  return res.json()
}