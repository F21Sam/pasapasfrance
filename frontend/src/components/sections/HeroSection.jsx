import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const CARD_ITEMS = [
  { ico: '✓', icoStyle: 'bg-success-light text-success', name: 'Titre de séjour',       sub: 'Préfecture · Validé',          badge: 'Terminé',  badgeStyle: 'badge-success' },
  { ico: '⟳', icoStyle: 'bg-pale text-navy',             name: 'Sécurité sociale (CPAM)', sub: 'Étape 2/4 · 1 doc manquant', badge: 'En cours', badgeStyle: 'badge-warning' },
  { ico: '○', icoStyle: 'bg-app-bg text-muted',          name: 'Compte bancaire',        sub: 'Disponible après CPAM',        badge: 'Bloqué',   badgeStyle: 'badge-muted' },
  { ico: '!', icoStyle: 'bg-warning-light text-warning', name: 'CAF – Aide logement',    sub: 'Délai légal : 30 jours',       badge: 'Urgent',   badgeStyle: 'badge-warning' },
]

export default function HeroSection() {
  const barRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = '36%'
    }, 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-navy-dark via-navy to-blue-700 overflow-hidden">

      {/* Decorative arc */}
      <div className="absolute -top-60 -right-52 w-[750px] h-[750px] rounded-full border-[90px] border-vivid/10 animate-spin-slow pointer-events-none" />

      {/* Grid dots */}
      <div className="absolute inset-0 grid-dots pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full">

          {/* ── Left ── */}
          <div className="animate-fade-up">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-7 text-mid-blue text-xs font-bold tracking-widest uppercase">
              <span className="block w-7 h-0.5 bg-vivid" />
              Assistant administratif
              <span className="w-1.5 h-1.5 rounded-full bg-vivid animate-pip" />
            </div>

            <h1 className="font-serif text-white leading-[1.1] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.6rem, 4.2vw, 3.8rem)' }}>
              L'administration française,{' '}
              <em className="not-italic text-gradient">enfin simple.</em>
            </h1>

            <p className="text-white/70 font-light leading-relaxed mb-10 max-w-md text-[1rem]">
              PasàPasFrance vous guide à travers toutes vos démarches — titre de séjour,
              CPAM, CAF, banque, logement — avec un parcours personnalisé selon votre profil.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/register" className="btn-primary">✦ Créer mon parcours</Link>
              <Link to="/register" className="btn-ghost">Voir une démo →</Link>
            </div>

            <div className="flex items-center gap-5 pt-8 border-t border-white/10">
              {['Gratuit', 'Sans inscription requise', 'Multilingue'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-white/55">
                  <span className="text-green-400 font-bold">✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Card stack ── */}
          <div className="relative h-[480px] animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {/* Back cards */}
            <div className="absolute inset-0 top-7 left-7 -right-3 bg-vivid/12 border border-vivid/20 rounded-[22px]"
                 style={{ transform: 'rotate(2.8deg)' }} />
            <div className="absolute inset-0 top-3.5 left-3.5 -right-1 bg-white/6 border border-white/12 rounded-[22px]"
                 style={{ transform: 'rotate(-1.3deg)' }} />

            {/* Front card */}
            <div className="absolute inset-0 bg-white rounded-[22px] overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,.35)]">

              {/* Card header */}
              <div className="bg-navy px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/45 text-xs">Bonjour !</p>
                  <p className="text-white font-serif text-[1.05rem]">Mon parcours administratif</p>
                </div>
                <span className="font-serif italic text-[2rem] text-mid-blue leading-none">36%</span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex justify-between text-xs text-muted mb-1.5">
                  <span>4 démarches complétées</span>
                  <span className="text-green-500 font-semibold">11 au total</span>
                </div>
                <div className="progress-bar mb-5">
                  <div ref={barRef} className="progress-fill" style={{ width: '0%' }} />
                </div>

                <div className="flex flex-col gap-2.5">
                  {CARD_ITEMS.map((item) => (
                    <div key={item.name}
                         className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-app-bg hover:border-vivid transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold ${item.icoStyle}`}>
                        {item.ico}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[.78rem] font-semibold text-text truncate">{item.name}</p>
                        <p className="text-[.66rem] text-muted mt-0.5">{item.sub}</p>
                      </div>
                      <span className={`text-[.62rem] font-semibold px-2.5 py-1 rounded-pill flex-shrink-0 ${item.badgeStyle}`}>
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
