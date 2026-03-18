import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle, Clock, Lock, Circle, ArrowRight } from 'lucide-react'
import { stepAPI } from '@/services/api'

const FILTERS = ['Toutes', 'À faire', 'En cours', 'Terminées', 'Bloquées']

const STATUS_MAP = {
  TERMINE:  { label: 'Terminé',  badge: 'badge-success', icon: <CheckCircle size={15} className="text-success" /> },
  EN_COURS: { label: 'En cours', badge: 'badge-warning', icon: <Clock size={15} className="text-warning" /> },
  BLOQUE:   { label: 'Bloqué',   badge: 'badge-muted',   icon: <Lock size={15} className="text-muted" /> },
  A_FAIRE:  { label: 'À faire',  badge: 'badge-navy',    icon: <Circle size={15} className="text-vivid" /> },
}

const PRIORITY_BORDER = {
  URGENTE:    'border-l-warning',
  IMPORTANTE: 'border-l-vivid',
  OPTIONNELLE:'border-l-border',
}

export default function DemarchesPage() {
  const [demarches, setDemarches] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('Toutes')

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => fetchDemarches(), 300)
    return () => clearTimeout(timer)
  }, [search, filter])

  const fetchDemarches = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (filter === 'À faire')   params.statut = 'A_FAIRE'
      if (filter === 'En cours')  params.statut = 'EN_COURS'
      if (filter === 'Terminées') params.statut = 'TERMINE'
      if (filter === 'Bloquées')  params.statut = 'BLOQUE'

      const res = await stepAPI.getSteps(params)
      setDemarches(res.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-navy text-3xl mb-1">Mes démarches</h1>
        <p className="text-muted text-sm font-light">Suivez et gérez toutes vos démarches administratives.</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rechercher une démarche..."
            className="input pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-pill text-xs font-semibold border transition-all ${
                filter === f
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-slate border-border hover:border-navy/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-vivid/30 border-t-vivid rounded-full animate-spin" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {demarches.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-muted font-light">Aucune démarche trouvée.</p>
            </div>
          )}
          {demarches.map(d => {
            const s = STATUS_MAP[d.statut] ?? STATUS_MAP.A_FAIRE
            const borderColor = PRIORITY_BORDER[d.priorite] ?? 'border-l-border'
            return (
              <Link
                key={d.id}
                to={`/app/demarches/${d.id}`}
                className={`card p-5 border-l-4 ${borderColor} flex items-center gap-4 group`}
              >
                <div className="flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 className="font-semibold text-navy text-sm">{d.titre}</h3>
                    <span className={`${s.badge} text-[.65rem]`}>{s.label}</span>
                    {d.priorite === 'URGENTE' && (
                      <span className="badge-warning text-[.65rem]">Urgent</span>
                    )}
                  </div>
                  <p className="text-xs text-muted font-light truncate">{d.description}</p>
                  {d.statut !== 'BLOQUE' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="progress-bar flex-1 max-w-[140px]">
                        <div className="progress-fill" style={{ width: `${d.progression ?? 0}%` }} />
                      </div>
                      <span className="text-xs text-muted">{d.progression ?? 0}%</span>
                    </div>
                  )}
                  {d.statut === 'BLOQUE' && d.dependances?.length > 0 && (
                    <p className="text-xs text-muted mt-1.5">
                      🔒 Prérequis non complétés
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="text-xs text-muted">{d.organisme}</span>
                    <span className="text-xs text-muted font-light">{d.delai}</span>
                  </div>
                  <ArrowRight size={16} className="text-border group-hover:text-navy transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
