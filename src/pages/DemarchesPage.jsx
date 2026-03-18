import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle, Clock, Lock, Circle, ArrowRight } from 'lucide-react'
import { DEMARCHES } from '@/utils/mockData'

const FILTERS = ['Toutes', 'À faire', 'En cours', 'Terminées', 'Bloquées']

const STATUS_MAP = {
  termine:  { label: 'Terminé',  badge: 'badge-success', icon: <CheckCircle size={15} className="text-success" /> },
  en_cours: { label: 'En cours', badge: 'badge-warning', icon: <Clock size={15} className="text-warning" /> },
  bloque:   { label: 'Bloqué',   badge: 'badge-muted',   icon: <Lock size={15} className="text-muted" /> },
  a_faire:  { label: 'À faire',  badge: 'badge-navy',    icon: <Circle size={15} className="text-vivid" /> },
}

const PRIORITY_BORDER = { urgent: 'border-l-warning', importante: 'border-l-vivid', optionnelle: 'border-l-border' }

export default function DemarchesPage() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('Toutes')

  const filtered = DEMARCHES.filter(d => {
    const matchSearch = d.titre.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'Toutes'   ? true :
      filter === 'À faire'  ? d.statut === 'a_faire' :
      filter === 'En cours' ? d.statut === 'en_cours' :
      filter === 'Terminées'? d.statut === 'termine' :
      filter === 'Bloquées' ? d.statut === 'bloque' : true
    return matchSearch && matchFilter
  })

  return (
    <div className="p-8">

      {/* Header */}
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

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-muted font-light">Aucune démarche trouvée.</p>
          </div>
        )}
        {filtered.map(d => {
          const s = STATUS_MAP[d.statut] ?? STATUS_MAP.a_faire
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
                  {d.priorite === 'urgent' && (
                    <span className="badge-warning text-[.65rem]">Urgent</span>
                  )}
                </div>
                <p className="text-xs text-muted font-light truncate">{d.description}</p>
                {d.statut !== 'bloque' && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="progress-bar flex-1 max-w-[140px]">
                      <div className="progress-fill" style={{ width: `${d.progression}%` }} />
                    </div>
                    <span className="text-xs text-muted">{d.progression}%</span>
                  </div>
                )}
                {d.statut === 'bloque' && d.dependances.length > 0 && (
                  <p className="text-xs text-muted mt-1.5">
                    🔒 Disponible après :{' '}
                    {d.dependances.map(id => DEMARCHES.find(x => x.id === id)?.titre).join(', ')}
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
    </div>
  )
}
