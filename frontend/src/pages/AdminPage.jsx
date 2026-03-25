import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, FolderOpen, Trash2, RefreshCw, Plus, X, Save, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

const adminAPI = {
  getStats:       () => api.get('/admin/stats'),
  getUsers:       () => api.get('/admin/users'),
  deleteUser:     (id) => api.delete(`/admin/users/${id}`),
  getSteps:       () => api.get('/admin/steps'),
  createStep:     (data) => api.post('/admin/steps', data),
  updateStep:     (id, data) => api.put(`/admin/steps/${id}`, data),
  deleteStep:     (id) => api.delete(`/admin/steps/${id}`),
}

// ── Stat Card ──────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card px-6 py-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-muted mb-0.5">{label}</p>
        <p className="font-serif text-3xl font-bold text-navy">{value ?? '—'}</p>
      </div>
    </div>
  )
}

// ── Modal confirmation suppression ────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-float p-6 w-full max-w-sm z-10">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-warning flex-shrink-0" />
          <p className="font-semibold text-navy">Confirmer la suppression</p>
        </div>
        <p className="text-sm text-muted font-light mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-slate text-sm hover:bg-app-bg transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal démarche (create/edit) ───────────────
function StepModal({ step, onSave, onClose }) {
  const [form, setForm] = useState({
    titre:       step?.titre       ?? '',
    description: step?.description ?? '',
    organisme:   step?.organisme   ?? '',
    delai:       step?.delai       ?? '',
    priorite:    step?.priorite    ?? 'IMPORTANTE',
    siteOfficiel:step?.siteOfficiel?? '',
  })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.titre) return
    setLoading(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-float w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-navy">{step ? 'Modifier la démarche' : 'Nouvelle démarche'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-navy hover:bg-app-bg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="label">Titre *</label>
            <input className="input" value={form.titre} onChange={e => set('titre', e.target.value)} placeholder="Ex: Titre de séjour" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px] resize-none" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description de la démarche..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Organisme</label>
              <input className="input" value={form.organisme} onChange={e => set('organisme', e.target.value)} placeholder="Ex: Préfecture" />
            </div>
            <div>
              <label className="label">Délai estimé</label>
              <input className="input" value={form.delai} onChange={e => set('delai', e.target.value)} placeholder="Ex: 2-3 mois" />
            </div>
          </div>
          <div>
            <label className="label">Priorité</label>
            <select className="input" value={form.priorite} onChange={e => set('priorite', e.target.value)}>
              <option value="URGENTE">Urgente</option>
              <option value="IMPORTANTE">Importante</option>
              <option value="OPTIONNELLE">Optionnelle</option>
            </select>
          </div>
          <div>
            <label className="label">Site officiel</label>
            <input className="input" value={form.siteOfficiel} onChange={e => set('siteOfficiel', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-slate text-sm hover:bg-app-bg transition-colors">
            Annuler
          </button>
          <button onClick={handleSave} disabled={loading || !form.titre}
            className="flex-1 px-4 py-2.5 rounded-xl bg-vivid text-white text-sm font-semibold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            {step ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
export default function AdminPage() {
  const { user }                  = useAuth()
  const navigate                  = useNavigate()
  const [tab, setTab]             = useState('stats')
  const [stats, setStats]         = useState(null)
  const [users, setUsers]         = useState([])
  const [steps, setSteps]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [confirm, setConfirm]     = useState(null)
  const [stepModal, setStepModal] = useState(null)
  const [error, setError]         = useState('')

  // Vérifier que l'user est admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/app/dashboard')
  }, [user])

  useEffect(() => { fetchData() }, [tab])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'stats') {
        const res = await adminAPI.getStats()
        setStats(res.data)
      } else if (tab === 'users') {
        const res = await adminAPI.getUsers()
        setUsers(res.data ?? [])
      } else if (tab === 'steps') {
        const res = await adminAPI.getSteps()
        setSteps(res.data ?? [])
      }
    } catch (err) {
      setError('Erreur lors du chargement des données.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      setConfirm(null)
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  const handleDeleteStep = async (stepId) => {
    try {
      await adminAPI.deleteStep(stepId)
      setSteps(prev => prev.filter(s => s.id !== stepId))
      setConfirm(null)
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  const handleSaveStep = async (form) => {
    try {
      if (stepModal?.id) {
        const res = await adminAPI.updateStep(stepModal.id, form)
        setSteps(prev => prev.map(s => s.id === stepModal.id ? res.data : s))
      } else {
        const res = await adminAPI.createStep(form)
        setSteps(prev => [...prev, res.data])
      }
    } catch {
      setError('Erreur lors de la sauvegarde.')
    }
  }

  const TABS = [
    { id: 'stats', label: 'Statistiques' },
    { id: 'users', label: 'Utilisateurs' },
    { id: 'steps', label: 'Démarches' },
  ]

  return (
    <div className="p-8">
      {confirm && <ConfirmModal {...confirm} />}
      {stepModal !== undefined && stepModal !== null && typeof stepModal === 'object' && 'open' in stepModal && stepModal.open && (
        <StepModal step={stepModal.data} onSave={handleSaveStep} onClose={() => setStepModal(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-navy text-3xl mb-1">Administration</h1>
          <p className="text-muted text-sm font-light">Gestion des utilisateurs et des démarches.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-xs text-slate hover:text-navy transition-colors">
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {error && (
        <div className="bg-warning-light border border-warning/30 text-warning text-sm rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
              tab === t.id ? 'border-vivid text-vivid' : 'border-transparent text-muted hover:text-navy'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-vivid/30 border-t-vivid rounded-full animate-spin" />
        </div>
      )}

      {/* ── STATS ── */}
      {!loading && tab === 'stats' && stats && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users}     label="Utilisateurs"  value={stats.totalUsers}     color="bg-vivid" />
            <StatCard icon={FileText}  label="Démarches"     value={stats.totalSteps}     color="bg-navy" />
            <StatCard icon={FolderOpen}label="Documents"     value={stats.totalDocuments} color="bg-success" />
            <StatCard icon={FileText}  label="Parcours générés" value={stats.totalJourneys} color="bg-warning" />
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-navy mb-4">Inscriptions récentes</h2>
            {stats.recentUsers?.length === 0 ? (
              <p className="text-muted text-sm font-light">Aucun utilisateur récent.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.recentUsers?.map(u => (
                  <div key={u.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pale flex items-center justify-center text-navy font-bold text-sm">
                        {u.prenom?.[0] ?? 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{u.prenom}</p>
                        <p className="text-xs text-muted">{u.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {!loading && tab === 'users' && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <p className="font-semibold text-navy text-sm">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
          </div>
          {users.length === 0 ? (
            <div className="p-12 text-center text-muted font-light text-sm">Aucun utilisateur.</div>
          ) : (
            <div className="divide-y divide-border">
              {users.map(u => (
                <div key={u.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-pale flex items-center justify-center text-navy font-bold flex-shrink-0">
                    {u.prenom?.[0] ?? 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy">{u.prenom}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-pill ${
                      u.profile?.statut ? 'badge-navy' : 'badge-muted'
                    }`}>
                      {u.profile?.statut?.toLowerCase() ?? 'Sans profil'}
                    </span>
                    <p className="text-xs text-muted hidden sm:block">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => setConfirm({
                          message: `Supprimer l'utilisateur "${u.prenom}" (${u.email}) ? Cette action est irréversible.`,
                          onConfirm: () => handleDeleteUser(u.id),
                          onCancel: () => setConfirm(null),
                        })}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEPS ── */}
      {!loading && tab === 'steps' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setStepModal({ open: true, data: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-pill bg-vivid text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              <Plus size={15} /> Nouvelle démarche
            </button>
          </div>

          {stepModal?.open && (
            <StepModal
              step={stepModal.data}
              onSave={handleSaveStep}
              onClose={() => setStepModal(null)}
            />
          )}

          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="font-semibold text-navy text-sm">{steps.length} démarche{steps.length > 1 ? 's' : ''}</p>
            </div>
            {steps.length === 0 ? (
              <div className="p-12 text-center text-muted font-light text-sm">Aucune démarche.</div>
            ) : (
              <div className="divide-y divide-border">
                {steps.map(s => (
                  <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-navy">{s.titre}</p>
                        <span className={`text-[.65rem] font-semibold px-2 py-0.5 rounded-pill ${
                          s.priorite === 'URGENTE'    ? 'badge-warning' :
                          s.priorite === 'IMPORTANTE' ? 'badge-navy'    : 'badge-muted'
                        }`}>{s.priorite?.toLowerCase()}</span>
                      </div>
                      <p className="text-xs text-muted">{s.organisme} · {s.delai}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setStepModal({ open: true, data: s })}
                        className="p-1.5 rounded-lg text-muted hover:text-vivid hover:bg-pale transition-all text-xs font-medium px-3"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => setConfirm({
                          message: `Supprimer la démarche "${s.titre}" ? Cette action est irréversible.`,
                          onConfirm: () => handleDeleteStep(s.id),
                          onCancel: () => setConfirm(null),
                        })}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
