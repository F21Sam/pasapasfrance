// ══════════════════════════════════════════════════════
// src/context/AuthContext.jsx
// Authentification réelle avec JWT
// ══════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, userAPI } from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // chargement initial

  // ── Au démarrage : restaurer la session depuis localStorage ──
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
          // Vérifier que le token est toujours valide
          const res = await userAPI.getMe()
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        } catch {
          // Token expiré ou invalide → nettoyer
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }

    restoreSession()
  }, [])

  // ── Register ──────────────────────────────────────
  const register = async ({ prenom, email, password }) => {
    const res = await authAPI.register({ prenom, email, password })
    const { user, accessToken, refreshToken } = res.data

    localStorage.setItem('accessToken',  accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user',         JSON.stringify(user))
    setUser(user)

    return user
  }

  // ── Login ─────────────────────────────────────────
  const login = async ({ email, password }) => {
    const res = await authAPI.login({ email, password })
    const { user, accessToken, refreshToken } = res.data

    localStorage.setItem('accessToken',  accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user',         JSON.stringify(user))
    setUser(user)

    return user
  }

  // ── Logout ────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  // ── Update user (après modification du profil) ────
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {/* Ne pas rendre les enfants tant que la session n'est pas restaurée */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
