import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    // Mock auth — replace with real API call
    await new Promise(r => setTimeout(r, 800))
    login({ email: form.email, prenom: 'Utilisateur' })
    navigate('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-app-bg flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-[480px] bg-navy-dark p-12 relative overflow-hidden">
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full border-[70px] border-vivid/10 animate-spin-slow" />
        <div className="absolute inset-0 grid-dots" />
        <div className="relative z-10 flex flex-col h-full">
          <Link to="/">
            <img src="/logo.png" alt="PasàPasFrance" className="h-9 w-auto brightness-0 invert opacity-90 mb-16" />
          </Link>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-serif text-white text-4xl leading-tight mb-5">
              Reprenez là où<br />
              <em className="italic text-gradient">vous vous êtes arrêté.</em>
            </h2>
            <p className="text-white/55 font-light leading-relaxed text-[.95rem]">
              Toutes vos démarches sauvegardées, vos documents organisés, vos rappels actifs.
            </p>
          </div>
          <p className="text-white/20 text-xs">© 2025 PasàPasFrance</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">

          <Link to="/" className="inline-flex items-center gap-2 text-slate text-sm hover:text-navy mb-8 transition-colors">
            <ArrowLeft size={15} />
            Retour à l'accueil
          </Link>

          <div className="lg:hidden mb-8">
            <img src="/logo.png" alt="PasàPasFrance" className="h-9 w-auto" />
          </div>

          <h1 className="font-serif text-navy text-3xl mb-2">Connexion</h1>
          <p className="text-muted text-sm font-light mb-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-vivid font-medium hover:underline">Créer un compte</Link>
          </p>

          {error && (
            <div className="bg-warning-light border border-warning/30 text-warning text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                className="input"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Mot de passe</label>
                <Link to="/forgot-password" className="text-xs text-vivid hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-11"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors"
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
