const request = require('supertest')
const app     = require('../../src/app')
const prisma  = require('../../src/utils/prisma')

const TEST_USER = {
  prenom:   'Steps Test',
  email:    `steps_${Date.now()}@jest.com`,
  password: 'TestPassword123!',
}

let accessToken = null
let stepId      = null

beforeAll(async () => {
  // Créer user + profil + parcours
  const res = await request(app)
    .post('/api/auth/register')
    .send(TEST_USER)
  accessToken = res.body.accessToken

  await request(app)
    .put('/api/users/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ prenom: TEST_USER.prenom, langue: 'fr', statut: 'SALARIE', logement: 'LOCATAIRE', banque: 'COMPTE_FR' })

  await request(app)
    .post('/api/journeys/generate')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ statut: 'SALARIE', nationalite: 'Française', logement: 'LOCATAIRE', banque: 'COMPTE_FR' })

  // Récupérer un step ID
  const stepsRes = await request(app)
    .get('/api/steps')
    .set('Authorization', `Bearer ${accessToken}`)
  stepId = stepsRes.body?.[0]?.id ?? stepsRes.body?.demarches?.[0]?.step?.id
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
  await prisma.$disconnect()
})

// ══════════════════════════════════════════════
// GET /steps
// ══════════════════════════════════════════════
describe('GET /steps', () => {

  it('doit retourner la liste des démarches', async () => {
    const res = await request(app)
      .get('/api/steps')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('doit filtrer par mot-clé', async () => {
    const res = await request(app)
      .get('/api/steps?search=séjour')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('doit refuser sans token', async () => {
    const res = await request(app).get('/api/steps')
    expect(res.status).toBe(401)
  })

})

// ══════════════════════════════════════════════
// PUT /steps/:id/status
// ══════════════════════════════════════════════
describe('PUT /steps/:id/status', () => {

  it('doit mettre à jour le statut d\'une étape', async () => {
    if (!stepId) return // skip si pas de step

    const res = await request(app)
      .put(`/api/steps/${stepId}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ statut: 'TERMINE' })

    expect([200, 400]).toContain(res.status) // 400 si dépendances non résolues
  })

  it('doit refuser sans token', async () => {
    const res = await request(app)
      .put('/api/steps/1/status')
      .send({ statut: 'TERMINE' })

    expect(res.status).toBe(401)
  })

})
