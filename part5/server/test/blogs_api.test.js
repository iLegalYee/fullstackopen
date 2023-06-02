const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blogs')
const User = require('../models/users')
const api = supertest(app)
const bcrypt = require('bcrypt')

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
  const loginCredentials = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api.post('/api/login').send(loginCredentials)
  token = response.body.token
})

describe('GET /api/blogs', () => {
  test('returns the correct amount of blog posts in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('each blog in the array has a unique identifier property named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body

    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('POST /api/blogs', () => {
  test('creates a new blog post', async () => {
    await User.findOne({})

    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'test url',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('responds with status 400 if title is missing', async () => {
    const newBlog = {
      // title property is intentionally missing
      author: 'Test Author',
      url: 'Test url',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('responds with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      // url property is intentionally missing
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('responds with status 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'test url',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer a')
      .send(newBlog)
      .expect(401)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('deletes a blog post by id', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'test url',
      likes: 1
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogId = createdBlog.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    const deletedBlog = blogs.find((blog) => blog.id === blogId)
    expect(deletedBlog).toBeUndefined()
  })
})

describe('PUT/blogs/:id', () => {
  test('update blog', async () => {
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate[0].likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
