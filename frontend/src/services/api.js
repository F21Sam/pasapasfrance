// ══════════════════════════════════════════════════════
// src/services/api.js
// Service API central — Axios + gestion JWT automatique
// ══════════════════════════════════════════════════════

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ── Instance Axios ──────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Intercepteur requête : ajoute le token JWT ──────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Intercepteur réponse : gère l'expiration du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Si 401 et pas déjà en train de retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        // Tenter de rafraîchir le token
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
        const { accessToken } = res.data

        localStorage.setItem('accessToken', accessToken)
        original.headers.Authorization = `Bearer ${accessToken}`

        return api(original)
      } catch (refreshError) {
        // Refresh échoué → déconnecter
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ══════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  refresh:  (refreshToken) => api.post('/auth/refresh', { refreshToken }),
}

// ══════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════
export const userAPI = {
  getMe:    ()     => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  deleteMe: ()     => api.delete('/users/me'),
}

// ══════════════════════════════════════════════════════
// JOURNEY
// ══════════════════════════════════════════════════════
export const journeyAPI = {
  generate:   (data) => api.post('/journeys/generate', data),
  getJourney: ()     => api.get('/journeys'),
}

// ══════════════════════════════════════════════════════
// STEPS / DÉMARCHES
// ══════════════════════════════════════════════════════
export const stepAPI = {
  getSteps:        (params) => api.get('/steps', { params }),
  getStep:         (id)     => api.get(`/steps/${id}`),
  updateStepStatus:(id, data) => api.put(`/steps/${id}/status`, data),
}

// ══════════════════════════════════════════════════════
// DOCUMENTS
// ══════════════════════════════════════════════════════
export const documentAPI = {
  getDocuments:   (params) => api.get('/documents', { params }),
  uploadDocument: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
}

// ══════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead:         (id) => api.put(`/notifications/${id}/read`),
  markAllRead:      () => api.put('/notifications/read-all'),
}

export default api