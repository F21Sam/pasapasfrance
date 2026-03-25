// ── All landing page sections except Hero ──
import { Link } from 'react-router-dom'

const MARQUEE_ITEMS = [
  'Titre de séjour','Sécurité sociale','Compte bancaire',
  'CAF','URSSAF','Logement','Mutuelle','Permis de conduire',
]

export function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="bg-navy-dark overflow-hidden py-4">
      <div className="flex gap-14 whitespace-nowrap animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="font-serif italic text-[.95rem] text-white/30 flex items-center gap-14">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-vivid flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function StatsSection() {
  const stats = [
    { num: '11+',    lbl: 'Démarches référencées' },
    { num: '5',      lbl: 'Profils pris en charge' },
    { num: '100%',   lbl: 'Sources officielles' },
    { num: 'FR · EN',lbl: 'Langues disponibles' },
  ]
  return (
    <div className="bg-white border-b border-border py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className={`text-center px-5 ${i < stats.length - 1 ? 'border-r border-border' : ''}`}>
            <p className="font-serif text-[2.2rem] text-navy tracking-tighter leading-none">{s.num}</p>
            <p className="text-xs text-muted mt-1">{s.lbl}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section renommée "Qui sommes-nous" avec ancre ──
export function ProcessSection() {
  const steps = [
    { n: '01', tag: '5 min',      title: 'Décrivez votre situation',  body: "Nationalité, statut, date d'arrivée. Trois questions suffisent à générer votre parcours." },
    { n: '02', tag: 'Automatique',title: 'Recevez votre parcours',     body: 'Un plan ordonné avec dépendances et priorités. Vous savez exactement quoi faire en premier.' },
    { n: '03', tag: 'Continu',    title: 'Avancez, étape par étape',   body: 'Cochez, uploadez vos documents, recevez des rappels. Votre avancement en temps réel.' },
  ]
  return (
    <section id="qui-sommes-nous" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Qui sommes-nous</p>
        <h2 className="sec-title text-[clamp(1.9rem,3vw,2.7rem)] mb-3">Votre parcours en trois étapes</h2>
        <p className="sec-body text-[.96rem] max-w-lg mb-2">
          Pas besoin de chercher sur dix sites différents. PasàPasFrance fait le tri pour vous, dans le bon ordre.
        </p>
        <Link to="/qui-sommes-nous" className="text-vivid text-sm font-semibold hover:underline mb-10 inline-block">
          En savoir plus sur le projet →
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-border rounded-2xl overflow-hidden mt-4">
          {steps.map((s) => (
            <div key={s.n}
                 className="bg-white px-8 py-10 relative overflow-hidden group hover:bg-pale transition-colors duration-200">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-navy to-vivid" />
              <span className="absolute top-5 right-5 bg-pale text-navy text-[.62rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-pill">
                {s.tag}
              </span>
              <p className="font-serif italic text-[4.5rem] leading-none text-pale mb-4 select-none">{s.n}</p>
              <h3 className="text-navy font-bold text-[1rem] mb-2">{s.title}</h3>
              <p className="text-slate font-light text-[.84rem] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProfilesSection() {
  const profiles = [
    { n: '01', icon: 'E', name: 'Etudiant etranger',    sub: 'Visa etudiant, CVEC, CROUS, CPAM',           count: '8 demarches' },
    { n: '02', icon: 'S', name: 'Salarie expatrie',     sub: 'Titre de sejour, URSSAF, mutuelle',           count: '11 demarches' },
    { n: '03', icon: 'A', name: 'Au pair / Volontaire', sub: 'Titre de sejour, securite sociale',           count: '7 demarches' },
    { n: '04', icon: 'R', name: 'Nouveau resident',     sub: 'Regroupement familial, CAF, ecole',           count: '9 demarches' },
    { n: '05', icon: 'P', name: 'Professionnel mobile', sub: 'Mission longue duree, visa, logement',        count: '6 demarches' },
  ]
  return (
    <section id="demarches" className="py-24 px-6 bg-app-bg">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Pour qui ?</p>
        <h2 className="sec-title text-[clamp(1.9rem,3vw,2.7rem)] mb-3">Adapté à votre profil</h2>
        <p className="sec-body text-[.96rem] max-w-lg mb-12">
          Chaque situation génère un parcours unique avec uniquement les démarches qui vous concernent.
        </p>

        <div className="border border-border rounded-2xl overflow-hidden bg-white divide-y divide-border">
          {profiles.map((p) => (
            <Link
              key={p.n}
              to="/register"
              className="flex items-center justify-between px-7 py-5 hover:bg-pale transition-colors duration-150 group"
            >
              <div className="flex items-center gap-5">
                <span className="font-serif italic text-[1.3rem] text-border w-7">{p.n}</span>

                <div>
                  <h4 className="text-[.92rem] font-semibold text-navy">{p.name}</h4>
                  <p className="text-[.75rem] text-muted font-light mt-0.5">{p.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="badge-navy hidden sm:inline-flex">{p.count}</span>
                <span className="text-border group-hover:text-navy transition-colors text-lg">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const MINI_BARS = [
  { lbl: 'Titre de séjour', pct: 100 },
  { lbl: 'CPAM',            pct: 50 },
  { lbl: 'Banque',          pct: 0 },
  { lbl: 'CAF',             pct: 0 },
]

const FEATURES = [
  { icon: '▶', title: 'Progression en temps réel', body: "Visualisez l'avancement de chaque démarche et votre taux global de complétion.", wide: true },
  { icon: '◉', title: 'Rappels intelligents',       body: 'Alertes sur vos échéances légales et documents manquants.' },
  { icon: '▣', title: 'Gestion documentaire',       body: "Uploadez, organisez et suivez l'état de chacun de vos justificatifs." },
  { icon: '◈', title: 'Dépendances visuelles',      body: 'Sachez exactement quoi débloquer pour avancer dans votre parcours.' },
  { icon: '◎', title: 'Sources officielles',        body: 'Chaque démarche pointe vers les sites gouvernementaux officiels.' },
  { icon: '◐', title: 'Multilingue',                body: "Interface en français et en anglais. D'autres langues à venir." },
]
export function BentoSection() {
  return (
    <section className="py-24 px-6 bg-navy-dark">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow" style={{ color: '#BDD7F5' }}>Fonctionnalités</p>
        <h2 className="sec-title text-white text-[clamp(1.9rem,3vw,2.7rem)] mb-3">Tout ce dont vous avez besoin</h2>
        <p className="sec-body text-white/55 text-[.96rem] max-w-lg mb-12">
          Un tableau de bord conçu pour être rassurant et efficace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`bg-white/5 border border-white/9 rounded-[18px] p-7 hover:bg-white/9 hover:-translate-y-1 transition-all duration-200 ${f.wide ? 'md:col-span-2' : ''}`}
            >
              <div className="w-11 h-11 rounded-xl bg-vivid/18 flex items-center justify-center text-white font-bold text-sm mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-[.95rem] mb-2">{f.title}</h3>
              <p className="text-white/50 font-light text-[.82rem] leading-relaxed">{f.body}</p>

              {f.wide && (
                <div className="mt-5 flex flex-col gap-2">
                  {MINI_BARS.map((b) => (
                    <div key={b.lbl} className="flex items-center gap-3">
                      <span className="text-[.7rem] text-white/40 w-28 flex-shrink-0">{b.lbl}</span>
                      <div className="flex-1 h-1.5 bg-white/8 rounded-pill overflow-hidden">
                        <div className="h-full rounded-pill bg-gradient-to-r from-vivid to-blue-400" style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-[.68rem] font-semibold text-white/50 w-7 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-navy to-vivid relative overflow-hidden">
      <div className="absolute right-[-60px] top-[-80px] font-serif italic text-[18rem] text-white/4 leading-none select-none pointer-events-none">
        PàPF
      </div>
      <div className="max-w-2xl relative z-10">
        <img src="/logo.png" alt="PasàPasFrance" className="h-14 w-auto mb-8 brightness-0 invert opacity-90" />
        <h2 className="font-serif text-white leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>
          Prêt à démarrer votre parcours ?
        </h2>
        <p className="text-white/72 font-light leading-relaxed mb-9 text-[.98rem] max-w-md">
          Créez votre profil gratuitement et recevez votre liste personnalisée de démarches en moins de deux minutes.
        </p>
        <Link to="/register" className="btn-white inline-block">
          S'inscrire gratuitement →
        </Link>
      </div>
    </section>
  )
}

export function FooterSection() {
  return (
    <footer className="bg-navy px-6 py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">

          {/* Logo + description */}
          <div className="max-w-xs">
            <img src="/logo.png" alt="PasàPasFrance" className="h-9 w-auto mb-4" />
            <p className="text-white/50 text-xs font-light leading-relaxed">
              Accompagnement administratif pour les nouveaux arrivants en France.
              Un parcours personnalisé, ordonné et visualisable.
            </p>
          </div>

          {/* Liens */}
          <div className="flex flex-wrap gap-12">
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Navigation</p>
              <div className="flex flex-col gap-2.5">
                <Link to="/" className="text-white/50 text-xs hover:text-white transition-colors">Accueil</Link>
                <Link to="/qui-sommes-nous" className="text-white/50 text-xs hover:text-white transition-colors">Qui sommes-nous</Link>
                <Link to="/nous-contacter" className="text-white/50 text-xs hover:text-white transition-colors">Nous contacter</Link>
              </div>
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Compte</p>
              <div className="flex flex-col gap-2.5">
                <Link to="/login"    className="text-white/50 text-xs hover:text-white transition-colors">Se connecter</Link>
                <Link to="/register" className="text-white/50 text-xs hover:text-white transition-colors">S'inscrire</Link>
              </div>
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Projet</p>
              <div className="flex flex-col gap-2.5">
                <a href="https://github.com/F21Sam/pasapasfrance" target="_blank" rel="noreferrer"
                   className="text-white/50 text-xs hover:text-white transition-colors">GitHub</a>
                <span className="text-white/30 text-xs">React · Node.js · PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            Projet académique UML & Fullstack · ESGI Paris · 2025-2026
          </p>
          <p className="text-white/30 text-xs">
            Fait avec soin par Fanta Samassa & Ekshade Kakpo
          </p>
        </div>
      </div>
    </footer>
  )
}