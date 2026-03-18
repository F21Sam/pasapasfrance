import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, Info, FileWarning, CheckCheck } from 'lucide-react'
import { notificationAPI } from '@/services/api'

const TYPE_MAP = {
  URGENT:   { icon: <AlertTriangle size={16} className="text-warning" />, bg: 'bg-warning-light', border: 'border-warning/20' },
  DOCUMENT: { icon: <FileWarning size={16} className="text-vivid" />,     bg: 'bg-pale',          border: 'border-vivid/20' },
  INFO:     { icon: <Info size={16} className="text-muted" />,            bg: 'bg-app-bg',        border: 'border-border' },
}

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications()
      setNotifs(res.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id)
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead()
      setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const unread = notifs.filter(n => !n.lu).length

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-[400px]">
      <div className="w-6 h-6 border-2 border-vivid/30 border-t-vivid rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-navy text-3xl mb-1">Notifications</h1>
          <p className="text-muted text-sm font-light">
            {unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est à jour ✓'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-vivid hover:underline font-semibold"
          >
            <CheckCheck size={14} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {notifs.length === 0 && (
        <div className="card p-16 text-center">
          <Bell size={36} className="text-border mx-auto mb-3" />
          <p className="text-muted font-light text-sm">Aucune notification pour le moment.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {notifs.map(n => {
          const t = TYPE_MAP[n.type] ?? TYPE_MAP.INFO
          return (
            <div
              key={n.id}
              onClick={() => !n.lu && markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-card ${t.bg} ${t.border} ${!n.lu ? 'ring-1 ring-offset-1 ring-vivid/20' : 'opacity-70'}`}
            >
              <div className="mt-0.5 flex-shrink-0">{t.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.lu ? 'text-muted font-light' : 'text-navy font-medium'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-muted mt-1">
                  {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {!n.lu && <div className="w-2 h-2 rounded-full bg-vivid flex-shrink-0 mt-1.5" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
