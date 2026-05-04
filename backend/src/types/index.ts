export interface User {
  id: number
  email: string
  name: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  createdAt: string
  updatedAt: string
  user?: User
  likes?: Like[]
  comments?: Comment[]
}

export interface Comment {
  id: number
  text: string
  userId: number
  postId: number
  createdAt: string
  user?: User
}

export interface Like {
  id: number
  userId: number
  postId: number
  createdAt: string
}