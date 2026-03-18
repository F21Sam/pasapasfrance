import { useState } from 'react'
import { Bell, AlertTriangle, Info, FileWarning, CheckCheck } from 'lucide-react'
import { NOTIFICATIONS } from '@/utils/mockData'

const TYPE_MAP = {
  urgent: { icon: <AlertTriangle size={16} className="text-warning" />, bg: 'bg-warning-light', border: 'border-warning/20' },
  doc:    { icon: <FileWarning size={16} className="text-vivid" />,     bg: 'bg-pale',          border: 'border-vivid/20' },
  info:   { icon: <Info size={16} className="text-muted" />,            bg: 'bg-app-bg',        border: 'border-border' },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))

  const unread = notifs.filter(n => !n.lu).length

  return (
    <div className="p-8 max-w-2xl">

      {/* Header */}
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
          const t = TYPE_MAP[n.type] ?? TYPE_MAP.info
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-card ${t.bg} ${t.border} ${!n.lu ? 'ring-1 ring-offset-1 ring-vivid/20' : 'opacity-70'}`}
            >
              <div className="mt-0.5 flex-shrink-0">{t.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.lu ? 'text-muted font-light' : 'text-navy font-medium'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-muted mt-1">{n.date}</p>
              </div>
              {!n.lu && (
                <div className="w-2 h-2 rounded-full bg-vivid flex-shrink-0 mt-1.5" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
