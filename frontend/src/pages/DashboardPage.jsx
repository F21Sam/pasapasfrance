import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle, CheckCircle, Clock, Lock } from 'lucide-react'
import { journeyAPI, notificationAPI } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

function StatCard({ label, value, sub, color = 'text-navy' }) {
  return (
    <div className="card px-6 py-5">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className={`font-serif text-3xl font-bold tracking-tight ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  )
}

function statusIcon(statut) {
  if (statut === 'TERMINE')  return <CheckCircle size={16} className="text-success" />
  if (statut === 'EN_COURS') return <Clock size={16} className="text-warning" />
  if (statut === 'BLOQUE')   return <Lock size={16} className="text-muted" />
  return <div className="w-4 h-4 rounded-full border-2 border-border" />
}

function priorityBar(priorite) {
  const map = { URGENTE: 'bg-warning', IMPORTANTE: 'bg-vivid', OPTIONNELLE: 'bg-border' }
  return <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${map[priorite] ?? 'bg-border'}`} />
}

export default function DashboardPage() {
  const { user }          = useAuth()
  const barRef            = useRef(null)
  const [demarches, setDemarches]       = useState([])
  const [notifications, setNotifications] = useState([])
  const [journey, setJourney]           = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journeyRes, notifRes] = await Promise.all([
          journeyAPI.getJourney(),
          notificationAPI.getNotifications(),
        ])
        setJourney(journeyRes.data.journey)
        setDemarches(journeyRes.data.demarches ?? [])
        setNotifications(notifRes.data ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const pct      = journey?.progression ?? 0
  const total    = demarches.length
  const done     = demarches.filter(d => d.statut === 'TERMINE').length
  const inProgress = demarches.filter(d => d.statut === 'EN_COURS').length
  const blocked  = demarches.filter(d => d.statut === 'BLOQUE').length
  const unread   = notifications.filter(n => !n.lu)
  const next     = demarches.filter(d => d.statut !== 'TERMINE' && d.statut !== 'BLOQUE').slice(0, 3)

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }, 400)
    return () => clearTimeout(t)
  }, [pct])

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-vivid/30 border-t-vivid rounded-full animate-spin" />
        <p className="text-muted text-sm">Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-muted text-sm font-light mb-1">Bonjour 👋</p>
        <h1 className="font-serif text-navy text-3xl">
          {user?.prenom ?? 'Bienvenue'}, voici votre tableau de bord
        </h1>
      </div>

      {/* Alertes */}
      {unread.length > 0 && (
        <div className="bg-warning-light border border-warning/30 rounded-2xl px-5 py-4 flex items-start gap-3 mb-6">
          <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning mb-1">{unread.length} alerte{unread.length > 1 ? 's' : ''} en attente</p>
            {unread.slice(0, 2).map(n => (
              <p key={n.id} className="text-xs text-warning/80 font-light">{n.message}</p>
            ))}
          </div>
          <Link to="/app/notifications" className="text-xs text-warning font-semibold hover:underline flex-shrink-0">
            Voir tout →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Démarches totales" value={total} />
        <StatCard label="Terminées"         value={done}       color="text-success" sub={`sur ${total}`} />
        <StatCard label="En cours"          value={inProgress} color="text-warning" />
        <StatCard label="Bloquées"          value={blocked}    color="text-muted" />
      </div>

      {/* Progression */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-navy text-sm">Progression globale</h2>
          <span className="font-serif italic text-2xl text-navy">{pct}%</span>
        </div>
        <div className="progress-bar mb-2">
          <div ref={barRef} className="progress-fill" style={{ width: '0%' }} />
        </div>
        <p className="text-xs text-muted">{done} démarche{done > 1 ? 's' : ''} complétée{done > 1 ? 's' : ''} sur {total}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prochaines étapes */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-navy">Prochaines étapes</h2>
            <Link to="/app/demarches" className="text-xs text-vivid hover:underline flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>

          {next.length === 0 ? (
            <p className="text-muted text-sm font-light text-center py-6">
              🎉 Toutes vos démarches sont complétées !
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {next.map(d => (
                <Link
                  key={d.id}
                  to={`/app/demarches/${d.id}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-vivid hover:bg-pale transition-all group"
                >
                  {priorityBar(d.priorite)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(d.statut)}
                      <p className="text-sm font-semibold text-navy truncate">{d.titre}</p>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div className="progress-fill" style={{ width: `${d.progression ?? 0}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[.7rem] font-semibold px-2.5 py-1 rounded-pill ${
                      d.priorite === 'URGENTE'    ? 'badge-warning' :
                      d.priorite === 'IMPORTANTE' ? 'badge-navy'    : 'badge-muted'
                    }`}>
                      {d.priorite?.toLowerCase()}
                    </span>
                    <ArrowRight size={14} className="text-border group-hover:text-navy transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-navy">Notifications</h2>
            <Link to="/app/notifications" className="text-xs text-vivid hover:underline">Voir tout</Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-muted text-sm font-light text-center py-4">Aucune notification</p>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} className={`p-3 rounded-xl text-xs leading-relaxed ${n.lu ? 'text-muted' : 'bg-pale text-navy font-medium'}`}>
                  <p>{n.message}</p>
                  <p className="mt-1 text-muted font-normal">
                    {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
