import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, FileText, FolderOpen,
  Bell, User, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { notificationAPI } from '@/services/api'

export default function AppLayout() {
  const { t }             = useTranslation()
  const { pathname }      = useLocation()
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const [unread, setUnread] = useState(0)

  const NAV_ITEMS = [
    { to: '/app/dashboard',     icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { to: '/app/demarches',     icon: FileText,        label: t('sidebar.demarches') },
    { to: '/app/documents',     icon: FolderOpen,      label: t('sidebar.documents') },
    { to: '/app/notifications', icon: Bell,            label: t('sidebar.notifications') },
    { to: '/app/profil',        icon: User,            label: t('sidebar.profile') },
  ]

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationAPI.getNotifications()
        setUnread((res.data ?? []).filter(n => !n.lu).length)
      } catch {}
    }
    fetchUnread()
  }, [pathname])

  return (
    <div className="min-h-screen flex bg-app-bg">
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full z-40">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/"><img src="/logo.png" alt="PasàPasFrance" className="h-8 w-auto" /></Link>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = pathname.startsWith(to)
            return (
              <Link key={to} to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon size={17} className={active ? 'text-navy' : 'text-slate'} />
                <span className="flex-1">{label}</span>
                {to === '/app/notifications' && unread > 0 && (
                  <span className="bg-warning text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
                )}
                {active && <ChevronRight size={14} className="text-navy/40" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-pale flex items-center justify-center text-navy font-bold text-sm">
              {user?.prenom?.[0] ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy truncate">{user?.prenom ?? 'Utilisateur'}</p>
              <p className="text-xs text-muted truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/') }} className="sidebar-link w-full text-slate hover:text-red-500">
            <LogOut size={16} />
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-h-screen"><Outlet /></main>
    </div>
  )
}
