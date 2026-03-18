import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CheckCircle, Clock, Circle, Lock, FileText } from 'lucide-react'
import { stepAPI } from '@/services/api'

const STEP_ICON = {
  TERMINE:  <CheckCircle size={17} className="text-success flex-shrink-0" />,
  EN_COURS: <Clock size={17} className="text-warning flex-shrink-0" />,
  A_FAIRE:  <Circle size={17} className="text-border flex-shrink-0" />,
}

export default function DemarcheDetail() {
  const { id }                    = useParams()
  const [demarche, setDemarche]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [updating, setUpdating]   = useState(null)

  useEffect(() => {
    const fetchDemarche = async () => {
      try {
        const res = await stepAPI.getStep(id)
        setDemarche(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDemarche()
  }, [id])

  const toggleEtape = async (etape) => {
    if (demarche.statut === 'BLOQUE') return
    setUpdating(etape.id)
    try {
      const newStatut = etape.statut === 'TERMINE' ? 'A_FAIRE' : 'TERMINE'
      const res = await stepAPI.updateStepStatus(id, {
        etapeId: etape.id,
        statut:  newStatut,
      })

      // Mettre à jour localement
      setDemarche(prev => ({
        ...prev,
        progression: res.data.progression,
        statut: res.data.progression === 100 ? 'TERMINE' : prev.statut === 'A_FAIRE' ? 'EN_COURS' : prev.statut,
        etapes: prev.etapes.map(e =>
          e.id === etape.id ? { ...e, statut: newStatut } : e
        )
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-vivid/30 border-t-vivid rounded-full animate-spin" />
    </div>
  )

  if (!demarche) return (
    <div className="p-8">
      <p className="text-muted">Démarche introuvable.</p>
      <Link to="/app/demarches" className="text-vivid hover:underline text-sm">← Retour</Link>
    </div>
  )

  const priorityColor = {
    URGENTE:    'bg-warning-light text-warning border-warning/30',
    IMPORTANTE: 'bg-pale text-navy border-navy/20',
    OPTIONNELLE:'bg-app-bg text-muted border-border',
  }[demarche.priorite] ?? 'bg-app-bg text-muted border-border'

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/app/demarches" className="inline-flex items-center gap-2 text-slate text-sm hover:text-navy mb-6 transition-colors">
        <ArrowLeft size={15} /> Retour aux démarches
      </Link>

      {/* Hero card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-pill border ${priorityColor}`}>
                {demarche.priorite?.toLowerCase()}
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
        <div className="flex items-center gap-3">
          <div className="progress-bar flex-1">
            <div className="progress-fill transition-all duration-500" style={{ width: `${demarche.progression ?? 0}%` }} />
          </div>
          <span className="text-sm font-semibold text-navy flex-shrink-0">{demarche.progression ?? 0}%</span>
        </div>
      </div>

      {/* Bloqué */}
      {demarche.statut === 'BLOQUE' && (
        <div className="bg-app-bg border border-border rounded-2xl px-5 py-4 flex items-center gap-3 mb-6">
          <Lock size={18} className="text-muted flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate">Démarche bloquée</p>
            <p className="text-xs text-muted font-light">Complétez d'abord les prérequis ci-dessous.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Étapes */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-navy mb-4">Étapes à suivre</h2>
          <div className="flex flex-col gap-3">
            {demarche.etapes?.map((etape, idx) => (
              <div key={etape.id} className="relative">
                {idx < demarche.etapes.length - 1 && (
                  <div className="absolute left-[22px] top-9 w-0.5 h-4 bg-border" />
                )}
                <button
                  onClick={() => toggleEtape(etape)}
                  disabled={demarche.statut === 'BLOQUE' || updating === etape.id}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all disabled:cursor-not-allowed ${
                    etape.statut === 'TERMINE'
                      ? 'bg-success-light border-success/20'
                      : 'bg-white border-border hover:border-navy/30'
                  }`}
                >
                  {updating === etape.id
                    ? <div className="w-4 h-4 border-2 border-navy/20 border-t-navy rounded-full animate-spin flex-shrink-0" />
                    : STEP_ICON[etape.statut] ?? STEP_ICON.A_FAIRE
                  }
                  <span className={`text-sm font-medium flex-1 ${etape.statut === 'TERMINE' ? 'text-success line-through' : 'text-navy'}`}>
                    {etape.nom}
                  </span>
                  <span className="text-xs text-muted">Étape {idx + 1}</span>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4 font-light">Cliquez sur une étape pour la marquer comme terminée.</p>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Documents */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy mb-4">Documents nécessaires</h2>
            <div className="flex flex-col gap-2.5">
              {demarche.step?.documents?.length > 0
                ? demarche.step.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-app-bg">
                      <FileText size={15} className="text-slate flex-shrink-0" />
                      <span className="text-xs font-medium text-slate">{doc.nom}</span>
                    </div>
                  ))
                : <p className="text-xs text-muted font-light">Aucun document spécifique requis.</p>
              }
            </div>
            <Link to="/app/documents" className="mt-5 w-full btn-outline text-xs flex items-center justify-center gap-1.5">
              Gérer mes documents
            </Link>
          </div>

          {/* Prérequis */}
          {demarche.dependances?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-navy mb-3">Prérequis</h2>
              <div className="flex flex-col gap-2">
                {demarche.dependances.map(dep => (
                  <Link
                    key={dep.id}
                    to={`/app/demarches/${dep.id}`}
                    className="flex items-center gap-2 text-xs text-vivid hover:underline"
                  >
                    <Lock size={12} /> {dep.titre}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
