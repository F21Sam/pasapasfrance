const request = require('supertest')
const app     = require('../../src/app')
const prisma  = require('../../src/utils/prisma')

const TEST_USER = {
  prenom:   'Journey Test',
  email:    `journey_${Date.now()}@jest.com`,
  password: 'TestPassword123!',
}

let accessToken = null

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send(TEST_USER)
  accessToken = res.body.accessToken

  // Créer le profil
  await request(app)
    .put('/api/users/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      prenom:      TEST_USER.prenom,
      langue:      'fr',
      statut:      'ETUDIANT',
      nationalite: 'Camerounaise',
      logement:    'HEBERGE',
      banque:      'AUCUN',
    })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
  await prisma.$disconnect()
})

// ══════════════════════════════════════════════
// POST /journeys/generate
// ══════════════════════════════════════════════
describe('POST /journeys/generate', () => {

  it('doit générer un parcours pour un profil valide', async () => {
    const res = await request(app)
      .post('/api/journeys/generate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        statut:      'ETUDIANT',
        nationalite: 'Camerounaise',
        logement:    'HEBERGE',
        banque:      'AUCUN',
      })

    expect(res.status).toBe(201)
    expect(res.body.journey).toBeDefined()
    expect(res.body.demarches).toBeDefined()
    expect(Array.isArray(res.body.demarches)).toBe(true)
  })

  it('doit refuser sans token', async () => {
    const res = await request(app)
      .post('/api/journeys/generate')
      .send({ statut: 'ETUDIANT' })

    expect(res.status).toBe(401)
  })

})

// ══════════════════════════════════════════════
// GET /journeys
// ══════════════════════════════════════════════
describe('GET /journeys', () => {

  it('doit retourner le parcours de l\'utilisateur', async () => {
    const res = await request(app)
      .get('/api/journeys')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.journey).toBeDefined()
    expect(res.body.demarches).toBeDefined()
  })

  it('doit refuser sans token', async () => {
    const res = await request(app).get('/api/journeys')
    expect(res.status).toBe(401)
  })

})
