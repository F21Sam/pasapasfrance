import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Mail, Globe, LogOut, Save, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { userAPI } from '@/services/api'
import { PROFILS } from '@/utils/mockData'
import i18n from '@/i18n'

export default function ProfilePage() {
  const { t }                        = useTranslation()
  const { user, updateUser, logout } = useAuth()
  const navigate                     = useNavigate()
  const [saved, setSaved]            = useState(false)
  const [loading, setLoading]        = useState(false)
  const [error, setError]            = useState('')
  const [form, setForm]              = useState({
    prenom:      user?.prenom              ?? '',
    email:       user?.email               ?? '',
    statut:      user?.profile?.statut     ?? '',
    nationalite: user?.profile?.nationalite ?? '',
    langue:      user?.langue              ?? 'fr',
    logement:    user?.profile?.logement   ?? '',
    banque:      user?.profile?.banque     ?? '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await userAPI.updateMe(form)
      updateUser({ ...user, prenom: form.prenom, profile: res.data.profile ?? user.profile })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (lng) => {
    set('langue', lng)
    i18n.changeLanguage(lng)
    localStorage.setItem('langue', lng)
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-navy text-3xl mb-1">{t('profile.title')}</h1>
        <p className="text-muted text-sm font-light">{t('profile.subtitle')}</p>
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
            {PROFILS.find(p => p.value === form.statut?.toLowerCase())?.label ?? 'Profil non défini'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-warning-light border border-warning/30 text-warning text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Infos personnelles */}
        <div className="card p-6">
          <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <User size={16} /> {t('profile.personalInfo')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('profile.firstName')}</label>
              <input type="text" className="input" value={form.prenom}
                onChange={e => set('prenom', e.target.value)} />
            </div>
            <div>
              <label className="label flex items-center gap-1.5">
                <Mail size={13} /> {t('profile.email')}
              </label>
              <input type="email" className="input" value={form.email}
                onChange={e => set('email', e.target.value)} disabled />
            </div>
          </div>
        </div>

        {/* Profil administratif */}
        <div className="card p-6">
          <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
            <Globe size={16} /> {t('profile.adminProfile')}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">{t('profile.status')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROFILS.map(p => (
                  <button key={p.value} type="button"
                    onClick={() => set('statut', p.value.toUpperCase())}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all text-sm ${
                      form.statut === p.value.toUpperCase()
                        ? 'border-navy bg-pale text-navy'
                        : 'border-border text-slate hover:border-navy/40'
                    }`}>
                    <span>{p.emoji}</span>
                    <span className="text-xs font-medium truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('profile.housing')}</label>
                <select className="input" value={form.logement}
                  onChange={e => set('logement', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="HEBERGE">Hébergé(e)</option>
                  <option value="LOCATAIRE">Locataire</option>
                  <option value="PROPRIETAIRE">Propriétaire</option>
                </select>
              </div>
              <div>
                <label className="label">{t('profile.bank')}</label>
                <select className="input" value={form.banque}
                  onChange={e => set('banque', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="COMPTE_FR">Compte en France</option>
                  <option value="COMPTE_ETRANGER">Compte étranger</option>
                  <option value="AUCUN">Sans compte</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">{t('profile.language')}</label>
              <div className="flex gap-3">
                {[{v:'fr',l:'🇫🇷 Français'},{v:'en',l:'🇬🇧 English'}].map(lng => (
                  <button key={lng.v} type="button"
                    onClick={() => handleLanguageChange(lng.v)}
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
          <button type="button" onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate hover:text-red-500 transition-colors">
            <LogOut size={15} /> {t('profile.logout')}
          </button>
          <button type="submit" disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-pill font-semibold text-sm transition-all disabled:opacity-60 ${
              saved ? 'bg-success text-white' : 'btn-primary'
            }`}>
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : saved
                ? <><Check size={15} /> {t('profile.saved')}</>
                : <><Save size={15} /> {t('profile.save')}</>
            }
          </button>
        </div>
      </form>
    </div>
  )
}
