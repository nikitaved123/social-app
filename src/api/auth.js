const API_URL = 'http://localhost:3001/api/auth'

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Ошибка регистрации')
  }
  
  return data
}

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Ошибка входа')
  }
  
  return data
}

export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!res.ok) {
    throw new Error('Ошибка получения данных')
  }
  
  return res.json()
}