import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [form, setForm]       = useState({ prenom: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register }          = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.prenom || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs.'); return
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.'); return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    register({ email: form.email, prenom: form.prenom })
    navigate('/onboarding')
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
          <div className="flex-1 flex flex-col justify-center gap-6">
            <h2 className="font-serif text-white text-4xl leading-tight">
              Commencez votre<br />
              <em className="italic text-gradient">parcours aujourd'hui.</em>
            </h2>
            <p className="text-white/55 font-light leading-relaxed text-[.95rem]">
              Créez votre profil en 2 minutes et obtenez une liste personnalisée de toutes vos démarches, dans le bon ordre.
            </p>
            {/* Mini feature list */}
            {['Parcours généré en 2 min', 'Démarches ordonnées avec dépendances', 'Rappels et alertes automatiques'].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">✓</span>
                {f}
              </div>
            ))}
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

          <h1 className="font-serif text-navy text-3xl mb-2">Créer un compte</h1>
          <p className="text-muted text-sm font-light mb-8">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-vivid font-medium hover:underline">Se connecter</Link>
          </p>

          {error && (
            <div className="bg-warning-light border border-warning/30 text-warning text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Prénom</label>
              <input
                type="text"
                placeholder="Votre prénom"
                className="input"
                value={form.prenom}
                onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
              />
            </div>
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
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="8 caractères minimum"
                  className="input pr-11"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors">
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-pill transition-colors ${
                      form.password.length >= i * 3
                        ? i <= 2 ? 'bg-warning' : 'bg-success'
                        : 'bg-border'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Créer mon compte →'}
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-5 leading-relaxed">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="text-vivid hover:underline">conditions d'utilisation</a>
            {' '}et notre{' '}
            <a href="#" className="text-vivid hover:underline">politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
