import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Globe, LogOut, Save, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { PROFILS } from '@/utils/mockData'

export default function ProfilePage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    prenom:     user?.prenom    ?? '',
    email:      user?.email     ?? '',
    statut:     user?.profil?.statut      ?? '',
    nationalite:user?.profil?.nationalite ?? '',
    langue:     user?.profil?.langue      ?? 'fr',
    logement:   user?.profil?.logement    ?? '',
    banque:     user?.profil?.banque      ?? '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 600))
    login({ ...user, prenom: form.prenom, email: form.email, profil: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="p-8 max-w-2xl">

      <div className="mb-8">
        <h1 className="font-serif text-navy text-3xl mb-1">Mon profil</h1>
        <p className="text-muted text-sm font-light">Modifiez vos informations pour affiner votre parcours.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-5 card">
        <div className="w-14 h-14 rounded-full bg-pale flex items-center justify-center text-navy font-bold text-xl">
          {form.prenom?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <p className="font-semibold text-navy">{form.prenom || 'Utilisateur'}</p>
          <p className="text-xs text-muted">{form.email || '—'}</p>
          <p className="text-xs text-vivid mt-0.5">
            {PROFILS.find(p => p.value === form.statut)?.label ?? 'Profil non défini'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Infos personnelles */}
        <div className="card p-6">
          <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <User size={16} /> Informations personnelles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prénom</label>
              <input type="text" className="input" value={form.prenom}
                onChange={e => set('prenom', e.target.value)} />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Mail size={13} /> Email</label>
              <input type="email" className="input" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Profil administratif */}
        <div className="card p-6">
          <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Globe size={16} /> Profil administratif
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Statut</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROFILS.map(p => (
                  <button key={p.value} type="button" onClick={() => set('statut', p.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all text-sm ${
                      form.statut === p.value ? 'border-navy bg-pale text-navy' : 'border-border text-slate hover:border-navy/40'
                    }`}>
                    <span>{p.emoji}</span>
                    <span className="text-xs font-medium truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Situation logement</label>
                <select className="input" value={form.logement} onChange={e => set('logement', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="heberge">Hébergé(e)</option>
                  <option value="locataire">Locataire</option>
                  <option value="proprio">Propriétaire</option>
                </select>
              </div>
              <div>
                <label className="label">Situation bancaire</label>
                <select className="input" value={form.banque} onChange={e => set('banque', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="compte_fr">Compte en France</option>
                  <option value="etranger">Compte étranger</option>
                  <option value="aucun">Sans compte</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Langue préférée</label>
              <div className="flex gap-3">
                {[{v:'fr',l:'🇫🇷 Français'},{v:'en',l:'🇬🇧 English'}].map(lng => (
                  <button key={lng.v} type="button" onClick={() => set('langue', lng.v)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.langue === lng.v ? 'border-navy bg-pale text-navy' : 'border-border text-slate'
                    }`}>
                    {lng.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate hover:text-red-500 transition-colors"
          >
            <LogOut size={15} /> Se déconnecter
          </button>

          <button type="submit"
            className={`flex items-center gap-2 px-6 py-3 rounded-pill font-semibold text-sm transition-all ${
              saved ? 'bg-success text-white' : 'btn-primary'
            }`}>
            {saved ? <><Check size={15} /> Sauvegardé !</> : <><Save size={15} /> Enregistrer</>}
          </button>
        </div>
      </form>
    </div>
  )
}
