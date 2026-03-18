// ══════════════════════════════════════════════════════
// Seed – Données initiales PasàPasFrance
// Lance avec : npm run db:seed
// ══════════════════════════════════════════════════════

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // ── Nettoyer la BDD ──
  await prisma.etapeProgression.deleteMany()
  await prisma.stepProgression.deleteMany()
  await prisma.stepDependance.deleteMany()
  await prisma.etape.deleteMany()
  await prisma.document.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.step.deleteMany()
  console.log('🗑️  BDD nettoyée')

  // ── Créer les démarches ──
  const titreSejour = await prisma.step.create({
    data: {
      titre:        'Titre de séjour',
      description:  'Obtenez votre titre de séjour pour résider légalement en France.',
      organisme:    'Préfecture',
      delai:        '2-3 mois',
      lienOfficiel: 'https://www.service-public.fr/particuliers/vosdroits/N110',
      priorite:     'URGENTE',
      profils:      ['ETUDIANT', 'SALARIE', 'AU_PAIR', 'RESIDENT', 'PROFESSIONNEL'],
      etapes: {
        create: [
          { nom: 'Prendre rendez-vous en ligne', ordre: 1 },
          { nom: 'Préparer le dossier',          ordre: 2 },
          { nom: 'Se présenter en préfecture',   ordre: 3 },
          { nom: 'Récupérer le titre',            ordre: 4 },
        ]
      }
    }
  })

  const cpam = await prisma.step.create({
    data: {
      titre:        'Sécurité sociale (CPAM)',
      description:  'Inscrivez-vous à l\'Assurance Maladie pour bénéficier des remboursements de soins.',
      organisme:    'CPAM',
      delai:        '3-6 semaines',
      lienOfficiel: 'https://www.ameli.fr',
      priorite:     'URGENTE',
      profils:      ['ETUDIANT', 'SALARIE', 'AU_PAIR', 'RESIDENT', 'PROFESSIONNEL'],
      etapes: {
        create: [
          { nom: 'Créer un compte Ameli',           ordre: 1 },
          { nom: 'Envoyer le dossier d\'inscription',ordre: 2 },
          { nom: 'Recevoir la carte Vitale',         ordre: 3 },
          { nom: 'Choisir un médecin traitant',      ordre: 4 },
        ]
      }
    }
  })

  const banque = await prisma.step.create({
    data: {
      titre:        'Compte bancaire',
      description:  'Ouvrez un compte bancaire en France pour gérer vos finances localement.',
      organisme:    'Banque',
      delai:        '1-2 semaines',
      lienOfficiel: 'https://www.service-public.fr',
      priorite:     'IMPORTANTE',
      profils:      ['ETUDIANT', 'SALARIE', 'RESIDENT', 'PROFESSIONNEL'],
      etapes: {
        create: [
          { nom: 'Choisir une banque',       ordre: 1 },
          { nom: 'Prendre rendez-vous',      ordre: 2 },
          { nom: 'Apporter les documents',   ordre: 3 },
          { nom: 'Activer la carte bancaire',ordre: 4 },
        ]
      }
    }
  })

  const caf = await prisma.step.create({
    data: {
      titre:        'CAF – Aide au logement',
      description:  'Demandez les aides au logement (APL, ALS) auxquelles vous avez droit.',
      organisme:    'CAF',
      delai:        '4-8 semaines',
      lienOfficiel: 'https://www.caf.fr',
      priorite:     'URGENTE',
      profils:      ['ETUDIANT', 'SALARIE', 'RESIDENT'],
      etapes: {
        create: [
          { nom: 'Créer un espace CAF',    ordre: 1 },
          { nom: 'Simuler les droits',     ordre: 2 },
          { nom: 'Déposer la demande',     ordre: 3 },
          { nom: 'Recevoir la notification',ordre: 4 },
        ]
      }
    }
  })

  const mutuelle = await prisma.step.create({
    data: {
      titre:        'Mutuelle santé',
      description:  'Souscrivez à une mutuelle complémentaire pour être mieux couvert.',
      organisme:    'Mutuelle privée',
      delai:        '1 semaine',
      lienOfficiel: 'https://www.complementaire-sante-solidaire.gouv.fr',
      priorite:     'IMPORTANTE',
      profils:      ['SALARIE', 'PROFESSIONNEL'],
      etapes: {
        create: [
          { nom: 'Comparer les offres',                ordre: 1 },
          { nom: 'Souscrire en ligne',                 ordre: 2 },
          { nom: 'Transmettre la carte au médecin',    ordre: 3 },
        ]
      }
    }
  })

  console.log('✅ Démarches créées')

  // ── Dépendances ──
  // Banque dépend de CPAM
  await prisma.stepDependance.create({
    data: { stepId: banque.id, requitId: cpam.id }
  })
  // CAF dépend de Banque
  await prisma.stepDependance.create({
    data: { stepId: caf.id, requitId: banque.id }
  })
  // Mutuelle dépend de CPAM
  await prisma.stepDependance.create({
    data: { stepId: mutuelle.id, requitId: cpam.id }
  })

  console.log('✅ Dépendances créées')
  console.log('🎉 Seed terminé !')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
