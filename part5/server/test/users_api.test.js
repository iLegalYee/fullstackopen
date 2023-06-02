const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/users')
const api = supertest(app)
const bcrypt = require('bcrypt')
require('mongoose-unique-validator')

describe('POST /api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creates a new user with valid credentials', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('returns 400 if username, password, or name is missing', async () => {
    const usersAtStart = await helper.usersInDb()
    // Test with missing fields
    const invalidUser = {

    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'Username, password, and name are required' })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('returns 400 if username or password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    // Test with short username
    const invalidUser1 = {
      username: 'ab',
      password: 'testpassword',
      name: 'Test User'
    }

    await api
      .post('/api/users')
      .send(invalidUser1)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'Username and password must be at least 3 characters long' })

    // Test with short password
    const invalidUser2 = {
      username: 'testuser',
      password: 'pw',
      name: 'Test User'
    }

    await api
      .post('/api/users')
      .send(invalidUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'Username and password must be at least 3 characters long' })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
