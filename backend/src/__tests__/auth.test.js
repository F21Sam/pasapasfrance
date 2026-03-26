const request = require('supertest')
const app     = require('../../src/app')
const prisma  = require('../../src/utils/prisma')

const TEST_USER = {
  prenom:   'Test User',
  email:    `test_${Date.now()}@jest.com`,
  password: 'TestPassword123!',
}

let accessToken  = null
let refreshToken = null

afterAll(async () => {
  // Nettoyer l'utilisateur de test
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
  await prisma.$disconnect()
})

// ══════════════════════════════════════════════
// REGISTER
// ══════════════════════════════════════════════
describe('POST /auth/register', () => {

  it('doit créer un compte avec des données valides', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_USER)

    expect(res.status).toBe(201)
    expect(res.body.user).toBeDefined()
    expect(res.body.user.email).toBe(TEST_USER.email)
    expect(res.body.accessToken).toBeDefined()
    expect(res.body.refreshToken).toBeDefined()
    expect(res.body.user.password).toBeUndefined() // mot de passe non exposé
  })

  it('doit refuser un email déjà utilisé', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_USER)

    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/déjà utilisé/i)
  })

  it('doit refuser un mot de passe trop court', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...TEST_USER, email: 'autre@jest.com', password: '123' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('doit refuser un email invalide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...TEST_USER, email: 'pasunemail' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

})

// ══════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════
describe('POST /auth/login', () => {

  it('doit connecter avec des identifiants valides', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
    expect(res.body.refreshToken).toBeDefined()
    expect(res.body.user.email).toBe(TEST_USER.email)
    expect(res.body.user.role).toBeDefined()

    accessToken  = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  it('doit refuser un mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: 'mauvais_mdp' })

    expect(res.status).toBe(401)
    expect(res.body.error).toMatch(/incorrect/i)
  })

  it('doit refuser un email inexistant', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inexistant@jest.com', password: 'TestPassword123!' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })

})

// ══════════════════════════════════════════════
// REFRESH TOKEN
// ══════════════════════════════════════════════
describe('POST /auth/refresh', () => {

  it('doit renouveler l\'access token avec un refresh token valide', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
  })

  it('doit refuser un refresh token invalide', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'token_invalide' })

    expect(res.status).toBe(401)
  })

  it('doit refuser une requête sans refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({})

    expect(res.status).toBe(401)
  })

})

module.exports = { getAccessToken: () => accessToken }
