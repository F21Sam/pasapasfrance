import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'

export default function NousContacterPage() {
  const [form, setForm]       = useState({ nom: '', email: '', sujet: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nom || !form.email || !form.message) {
      setError('Merci de remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    try {
      // Envoi via mailto comme fallback (pas de backend SMTP configuré)
      const subject = encodeURIComponent(`[PasàPasFrance] ${form.sujet || 'Contact'}`)
      const body    = encodeURIComponent(
        `Nom : ${form.nom}\nEmail : ${form.email}\n\n${form.message}`
      )
      window.location.href = `mailto:contact@pasapasfrance.fr?subject=${subject}&body=${body}`
      setSent(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-app-bg pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Retour */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted text-sm hover:text-navy transition-colors mb-8">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Retour à l'accueil
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-vivid text-xs font-bold tracking-widest uppercase mb-3">Contact</p>
            <h1 className="font-serif text-navy text-4xl mb-3">Nous contacter</h1>
            <p className="text-slate font-light">
              Une question, une suggestion ou un bug à signaler ? On vous répond rapidement.
            </p>
          </div>

          {sent ? (
            <div className="card p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" stroke="#2E7D32" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2 className="font-serif text-navy text-2xl mb-2">Message envoyé !</h2>
              <p className="text-muted font-light text-sm mb-6">
                Votre client mail s'est ouvert avec votre message pré-rempli. Envoyez-le pour nous contacter.
              </p>
              <Link to="/" className="btn-primary inline-flex">Retour à l'accueil</Link>
            </div>
          ) : (
            <div className="card p-8">
              {error && (
                <div className="bg-warning-light border border-warning/30 text-warning text-sm rounded-xl px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nom complet <span className="text-warning">*</span></label>
                    <input type="text" className="input" placeholder="Votre nom"
                      value={form.nom} onChange={e => set('nom', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Email <span className="text-warning">*</span></label>
                    <input type="email" className="input" placeholder="votre@email.com"
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="label">Sujet</label>
                  <select className="input" value={form.sujet} onChange={e => set('sujet', e.target.value)}>
                    <option value="">Choisir un sujet</option>
                    <option value="Question générale">Question générale</option>
                    <option value="Problème technique">Problème technique</option>
                    <option value="Suggestion d'amélioration">Suggestion d'amélioration</option>
                    <option value="Signalement d'un bug">Signalement d'un bug</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="label">Message <span className="text-warning">*</span></label>
                  <textarea
                    className="input min-h-[140px] resize-y"
                    placeholder="Décrivez votre demande..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                      </svg>
                    )
                  }
                  {loading ? 'Envoi...' : 'Envoyer le message'}
                </button>
              </form>

              {/* Infos contact */}
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-center text-center">
                <div>
                  <p className="text-xs text-muted mb-1">Email</p>
                  <p className="text-sm font-medium text-navy">contact@pasapasfrance.fr</p>
                </div>
                <div className="hidden sm:block w-px bg-border" />
                <div>
                  <p className="text-xs text-muted mb-1">GitHub</p>
                  <a href="https://github.com/F21Sam/pasapasfrance" target="_blank" rel="noreferrer"
                    className="text-sm font-medium text-vivid hover:underline">
                    F21Sam/pasapasfrance
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
