const Blog = require('../models/blogs')
const express = require('express')
const blogRouter = express.Router()
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'No user found' })
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const newBlog = {
    title,
    author,
    url,
    likes: likes || 0,
    user: user.id
  }

  const blog = new Blog(newBlog)
  const result = await blog.save()
  user.blogs = user.blogs ? user.blogs.concat(result._id) : [result._id]
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const { id } = request.params
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'No user found' })
  }

  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  const userId = user.id.toString()

  if (blog.user.toString() !== userId) {
    return response.status(403).json({ error: 'Unauthorized' })
  }

  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params

  const updatedBlog = {
    ...request.body
  }

  const result = await Blog.findByIdAndUpdate(id, updatedBlog, {
    new: true
  })

  response.json(result)
})

module.exports = blogRouter
