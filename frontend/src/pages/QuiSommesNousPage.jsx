import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
const TEAM = [
  {
    initiale: 'FS',
    nom: 'Fanta Samassa',
    role: 'Référente Frontend',
    desc: 'React.js, Tailwind CSS, i18n, dark mode, connexion API, pages et composants UI.',
  },
  {
    initiale: 'EK',
    nom: 'Ekshade Kakpo',
    role: 'Référent UML & Conception',
    desc: 'Cahier des charges, diagrammes UML, architecture logicielle, documentation et rapport.',
  },
]

export default function QuiSommesNousPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-app-bg pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Retour */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted text-sm hover:text-navy transition-colors mb-8">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Retour à l'accueil
          </Link>

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-vivid text-xs font-bold tracking-widest uppercase mb-3">Notre projet</p>
            <h1 className="font-serif text-navy text-4xl mb-4">Qui sommes-nous ?</h1>
            <p className="text-slate font-light text-lg max-w-2xl mx-auto">
              PasàPasFrance est un projet académique de fin de module UML et Développement Fullstack,
              réalisé par une équipe de 3 étudiants de l'ESGI Paris.
            </p>
          </div>

          {/* Le projet */}
          <div className="card p-8 mb-8">
            <h2 className="font-serif text-navy text-2xl mb-4">Le projet</h2>
            <p className="text-slate font-light leading-relaxed mb-4">
              PasàPasFrance est une application web conçue pour accompagner les nouveaux arrivants en France
              dans leurs démarches administratives. Face à la complexité du système administratif français,
              nous avons voulu créer un outil simple, structuré et accessible pour guider chaque utilisateur
              dans son parcours selon son profil personnel.
            </p>
            <p className="text-slate font-light leading-relaxed">
              L'application génère automatiquement un parcours personnalisé, ordonne les démarches par
              priorité et dépendances, et permet de suivre sa progression en temps réel.
            </p>
          </div>

          {/* Stack technique */}
          <div className="card p-8 mb-8">
            <h2 className="font-serif text-navy text-2xl mb-6">Notre stack technique</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ['Frontend', 'React.js + Vite + Tailwind CSS'],
                ['Backend', 'Node.js + Express'],
                ['Base de données', 'PostgreSQL + Prisma'],
                ['Auth', 'JWT (access + refresh)'],
                ['Automatisation', 'n8n'],
                ['Déploiement', 'Vercel + Render'],
              ].map(([label, value]) => (
                <div key={label} className="bg-pale rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">{label}</p>
                  <p className="text-sm font-semibold text-navy">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Équipe */}
          <div className="mb-8">
            <h2 className="font-serif text-navy text-2xl mb-6 text-center">L'équipe</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {TEAM.map((m) => (
                <div key={m.nom} className="card p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-pale flex items-center justify-center text-navy font-bold text-xl mx-auto mb-4">
                    {m.initiale}
                  </div>
                  <p className="font-semibold text-navy mb-1">{m.nom}</p>
                  <p className="text-xs text-vivid font-semibold mb-3">{m.role}</p>
                  <p className="text-xs text-muted font-light leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-muted text-sm mb-4">Une question sur le projet ?</p>
            <Link to="/nous-contacter" className="btn-primary inline-flex items-center gap-2">
              Nous contacter
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
