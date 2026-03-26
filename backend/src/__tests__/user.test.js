const request = require('supertest')
const app     = require('../../src/app')
const prisma  = require('../../src/utils/prisma')

const TEST_USER = {
  prenom:   'User Test',
  email:    `user_${Date.now()}@jest.com`,
  password: 'TestPassword123!',
}

let accessToken = null

beforeAll(async () => {
  // Créer un user de test et récupérer le token
  const res = await request(app)
    .post('/api/auth/register')
    .send(TEST_USER)
  accessToken = res.body.accessToken
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
  await prisma.$disconnect()
})

// ══════════════════════════════════════════════
// GET /users/me
// ══════════════════════════════════════════════
describe('GET /users/me', () => {

  it('doit retourner le profil de l\'utilisateur connecté', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe(TEST_USER.email)
    expect(res.body.prenom).toBe(TEST_USER.prenom)
    expect(res.body.role).toBeDefined()
    expect(res.body.password).toBeUndefined()
  })

  it('doit refuser sans token', async () => {
    const res = await request(app).get('/api/users/me')

    expect(res.status).toBe(401)
  })

  it('doit refuser avec un token invalide', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer token_invalide')

    expect(res.status).toBe(401)
  })

})

// ══════════════════════════════════════════════
// PUT /users/me
// ══════════════════════════════════════════════
describe('PUT /users/me', () => {

  it('doit mettre à jour le prénom', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ prenom: 'Nouveau Prénom', langue: 'fr' })

    expect(res.status).toBe(200)
  })

  it('doit mettre à jour le profil administratif', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        prenom:      'User Test',
        langue:      'fr',
        statut:      'ETUDIANT',
        nationalite: 'Française',
        logement:    'LOCATAIRE',
        banque:      'COMPTE_FR',
      })

    expect(res.status).toBe(200)
  })

  it('doit refuser sans token', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .send({ prenom: 'Test' })

    expect(res.status).toBe(401)
  })

})
