import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { user, logout }          = useAuth()
  const navigate                  = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const base = transparent && !scrolled
    ? 'bg-transparent border-transparent'
    : 'bg-white/94 border-border backdrop-blur-md shadow-sm'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${base}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="PasàPasFrance" className="h-9 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#comment-ca-marche" className="nav-link">Comment ça marche</Link>
          <Link to="/#demarches"         className="nav-link">Démarches</Link>
          {user ? (
            <>
              <Link to="/app/dashboard" className="nav-link">Mon tableau de bord</Link>
              <button onClick={handleLogout} className="nav-link">Se déconnecter</button>
              <Link to="/app/notifications" className="relative p-2 text-slate hover:text-navy transition-colors">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Se connecter</Link>
              <Link to="/register" className="btn-navy text-sm px-5 py-2">
                Commencer gratuitement
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-slate hover:text-navy"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-3">
          <Link to="/#comment-ca-marche" className="nav-link py-1" onClick={() => setMenuOpen(false)}>Comment ça marche</Link>
          <Link to="/#demarches"         className="nav-link py-1" onClick={() => setMenuOpen(false)}>Démarches</Link>
          {user ? (
            <>
              <Link to="/app/dashboard"  className="nav-link py-1" onClick={() => setMenuOpen(false)}>Tableau de bord</Link>
              <button onClick={handleLogout} className="nav-link py-1 text-left">Se déconnecter</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link py-1" onClick={() => setMenuOpen(false)}>Se connecter</Link>
              <Link to="/register" className="btn-navy text-center mt-1" onClick={() => setMenuOpen(false)}>Commencer</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
