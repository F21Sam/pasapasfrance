import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { PROFILS } from '@/utils/mockData'
import { useAuth } from '@/context/AuthContext'

const PAYS = ['Afghanistan','Algérie','Allemagne','Argentine','Belgique','Brésil','Canada',
  'Chine','Colombie','Côte d\'Ivoire','Espagne','États-Unis','Inde','Italie','Japon',
  'Liban','Maroc','Mexique','Portugal','Royaume-Uni','Russie','Sénégal','Suisse',
  'Tunisie','Turquie','Ukraine','Vietnam']

const STEPS = [
  { id: 1, title: 'Votre statut', subtitle: 'Quelle est votre situation principale ?' },
  { id: 2, title: 'Votre profil', subtitle: 'Quelques infos pour personnaliser votre parcours.' },
  { id: 3, title: 'Votre situation', subtitle: 'Dernières précisions pour affiner vos démarches.' },
]

export default function OnboardingPage() {
  const [step, setStep]   = useState(1)
  const [form, setForm]   = useState({
    statut: '', nationalite: '', dateArrivee: '',
    logement: '', banque: '', langue: 'fr',
  })
  const { user, login }   = useAuth()
  const navigate          = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const canNext = () => {
    if (step === 1) return !!form.statut
    if (step === 2) return !!form.nationalite && !!form.dateArrivee
    return !!form.logement && !!form.banque
  }

  const handleFinish = () => {
    login({ ...user, profil: form })
    navigate('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="PasàPasFrance" className="h-8 w-auto" />
        <div className="flex items-center gap-2">
          {STEPS.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s.id < step  ? 'bg-success text-white' :
                s.id === step ? 'bg-navy text-white' :
                'bg-border text-muted'
              }`}>
                {s.id < step ? <Check size={13} /> : s.id}
              </div>
              {s.id < STEPS.length && (
                <div className={`w-12 h-0.5 transition-colors ${s.id < step ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted">Étape {step}/{STEPS.length}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <p className="eyebrow">Personnalisation</p>
            <h1 className="font-serif text-navy text-3xl mb-2">{STEPS[step-1].title}</h1>
            <p className="text-muted font-light">{STEPS[step-1].subtitle}</p>
          </div>

          {/* ── Step 1: Statut ── */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROFILS.map(p => (
                <button
                  key={p.value}
                  onClick={() => set('statut', p.value)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                    form.statut === p.value
                      ? 'border-navy bg-pale'
                      : 'border-border bg-white hover:border-navy/40'
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className={`font-semibold text-sm ${form.statut === p.value ? 'text-navy' : 'text-text'}`}>
                      {p.label}
                    </p>
                  </div>
                  {form.statut === p.value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 2: Nationalité + date ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5 bg-white rounded-2xl border border-border p-6">
              <div>
                <label className="label">Nationalité</label>
                <select
                  className="input"
                  value={form.nationalite}
                  onChange={e => set('nationalite', e.target.value)}
                >
                  <option value="">Sélectionner un pays</option>
                  {PAYS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date d'arrivée en France</label>
                <input
                  type="date"
                  className="input"
                  value={form.dateArrivee}
                  onChange={e => set('dateArrivee', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Langue préférée</label>
                <div className="flex gap-3">
                  {[{v:'fr',l:'🇫🇷 Français'},{v:'en',l:'🇬🇧 English'}].map(lng => (
                    <button
                      key={lng.v}
                      onClick={() => set('langue', lng.v)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.langue === lng.v ? 'border-navy bg-pale text-navy' : 'border-border bg-white text-slate'
                      }`}
                    >
                      {lng.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Situation ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5 bg-white rounded-2xl border border-border p-6">
              <div>
                <label className="label">Situation de logement</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                  {[
                    { v:'heberge',  l:'Hébergé(e)' },
                    { v:'locataire',l:'Locataire' },
                    { v:'proprio',  l:'Propriétaire' },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => set('logement', opt.v)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.logement === opt.v ? 'border-navy bg-pale text-navy' : 'border-border text-slate hover:border-navy/40'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Situation bancaire</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                  {[
                    { v:'compte_fr', l:'Compte FR' },
                    { v:'etranger',  l:'Compte étranger' },
                    { v:'aucun',     l:'Sans compte' },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => set('banque', opt.v)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.banque === opt.v ? 'border-navy bg-pale text-navy' : 'border-border text-slate hover:border-navy/40'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              className={`flex items-center gap-2 text-sm text-slate hover:text-navy transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              <ArrowLeft size={15} /> Précédent
            </button>

            {step < STEPS.length ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canNext()}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Générer mon parcours ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
