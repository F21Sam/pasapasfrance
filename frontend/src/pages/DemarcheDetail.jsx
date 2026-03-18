import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CheckCircle, Clock, Circle, Lock, FileText } from 'lucide-react'
import { DEMARCHES } from '@/utils/mockData'

const STEP_ICON = {
  termine:  <CheckCircle size={17} className="text-success flex-shrink-0" />,
  en_cours: <Clock size={17} className="text-warning flex-shrink-0" />,
  a_faire:  <Circle size={17} className="text-border flex-shrink-0" />,
}

export default function DemarcheDetail() {
  const { id }      = useParams()
  const demarche    = DEMARCHES.find(d => d.id === parseInt(id))
  const [etapes, setEtapes] = useState(demarche?.etapes ?? [])

  if (!demarche) return (
    <div className="p-8">
      <p className="text-muted">Démarche introuvable.</p>
      <Link to="/app/demarches" className="text-vivid hover:underline text-sm">← Retour</Link>
    </div>
  )

  const toggleEtape = (etapeId) => {
    setEtapes(prev => prev.map(e =>
      e.id === etapeId
        ? { ...e, statut: e.statut === 'termine' ? 'a_faire' : 'termine' }
        : e
    ))
  }

  const pct = Math.round((etapes.filter(e => e.statut === 'termine').length / etapes.length) * 100)

  const priorityColor = {
    urgent:      'bg-warning-light text-warning border-warning/30',
    importante:  'bg-pale text-navy border-navy/20',
    optionnelle: 'bg-app-bg text-muted border-border',
  }[demarche.priorite] ?? 'bg-app-bg text-muted border-border'

  return (
    <div className="p-8 max-w-4xl">

      {/* Back */}
      <Link to="/app/demarches" className="inline-flex items-center gap-2 text-slate text-sm hover:text-navy mb-6 transition-colors">
        <ArrowLeft size={15} /> Retour aux démarches
      </Link>

      {/* Hero card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-pill border ${priorityColor}`}>
                {demarche.priorite}
              </span>
              <span className="text-xs text-muted">{demarche.organisme}</span>
              <span className="text-xs text-muted">· {demarche.delai}</span>
            </div>
            <h1 className="font-serif text-navy text-2xl">{demarche.titre}</h1>
          </div>
          <a
            href={demarche.lienOfficiel}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center gap-2 text-xs flex-shrink-0"
          >
            Site officiel <ExternalLink size={13} />
          </a>
        </div>
        <p className="text-slate font-light text-sm leading-relaxed mb-5">{demarche.description}</p>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="progress-bar flex-1">
            <div className="progress-fill transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-navy flex-shrink-0">{pct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Etapes ── */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-navy mb-4">Étapes à suivre</h2>
          <div className="flex flex-col gap-3">
            {etapes.map((etape, idx) => (
              <div key={etape.id} className="relative">
                {/* Connector line */}
                {idx < etapes.length - 1 && (
                  <div className="absolute left-[22px] top-9 w-0.5 h-4 bg-border" />
                )}
                <button
                  onClick={() => toggleEtape(etape.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    etape.statut === 'termine'
                      ? 'bg-success-light border-success/20'
                      : 'bg-white border-border hover:border-navy/30'
                  }`}
                >
                  {STEP_ICON[etape.statut] ?? STEP_ICON.a_faire}
                  <span className={`text-sm font-medium flex-1 ${etape.statut === 'termine' ? 'text-success line-through' : 'text-navy'}`}>
                    {etape.nom}
                  </span>
                  <span className="text-xs text-muted">Étape {idx + 1}</span>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4 font-light">Cliquez sur une étape pour la marquer comme terminée.</p>
        </div>

        {/* ── Documents ── */}
        <div className="card p-6">
          <h2 className="font-semibold text-navy mb-4">Documents nécessaires</h2>
          <div className="flex flex-col gap-2.5">
            {demarche.documents.map(doc => (
              <div key={doc} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-app-bg">
                <FileText size={15} className="text-slate flex-shrink-0" />
                <span className="text-xs font-medium text-slate">{doc}</span>
              </div>
            ))}
          </div>
          <Link
            to="/app/documents"
            className="mt-5 w-full btn-outline text-xs flex items-center justify-center gap-1.5"
          >
            Gérer mes documents
          </Link>

          {/* Dependances */}
          {demarche.dependances.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-xs font-semibold text-navy mb-2">Prérequis</p>
              {demarche.dependances.map(depId => {
                const dep = DEMARCHES.find(d => d.id === depId)
                return dep ? (
                  <Link key={depId} to={`/app/demarches/${depId}`}
                    className="flex items-center gap-2 text-xs text-vivid hover:underline">
                    <Lock size={12} /> {dep.titre}
                  </Link>
                ) : null
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
