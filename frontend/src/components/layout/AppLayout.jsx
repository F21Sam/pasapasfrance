import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, FileText, FolderOpen,
  Bell, User, LogOut, ChevronRight, Sun, Moon
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { notificationAPI } from '@/services/api'

export default function AppLayout() {
  const { t }              = useTranslation()
  const { pathname }       = useLocation()
  const { user, logout }   = useAuth()
  const { dark, toggle }   = useTheme()
  const navigate           = useNavigate()
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
    <div className="min-h-screen flex bg-app-bg dark:bg-gray-950">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-border dark:border-gray-800 flex flex-col fixed h-full z-40">

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border dark:border-gray-800">
          <Link to="/"><img src="/logo.png" alt="PasàPasFrance" className="h-8 w-auto" /></Link>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-muted hover:text-navy dark:hover:text-white hover:bg-pale dark:hover:bg-gray-800 transition-all"
            title={dark ? 'Mode clair' : 'Mode sombre'}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = pathname.startsWith(to)
            return (
              <Link key={to} to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon size={17} className={active ? 'text-navy dark:text-blue-300' : 'text-slate dark:text-gray-400'} />
                <span className="flex-1">{label}</span>
                {to === '/app/notifications' && unread > 0 && (
                  <span className="bg-warning text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
                )}
                {active && <ChevronRight size={14} className="text-navy/40 dark:text-blue-300/40" />}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-border dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-pale dark:bg-navy/30 flex items-center justify-center text-navy dark:text-blue-300 font-bold text-sm">
              {user?.prenom?.[0] ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy dark:text-white truncate">{user?.prenom ?? 'Utilisateur'}</p>
              <p className="text-xs text-muted dark:text-gray-500 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="sidebar-link w-full text-slate hover:text-red-500 dark:hover:text-red-400"
          >
            <LogOut size={16} />
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 ml-64 min-h-screen dark:text-gray-100">
        <Outlet />
      </main>
    </div>
  )
}
