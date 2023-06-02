const bcrypt = require('bcrypt')
const User = require('../models/users')
const userRouter = require('express').Router()

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (!username || !password || !name) {
    return response.status(400).json({ error: 'Username, password, and name are required' })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'Username is already taken' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

userRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  await User.findByIdAndRemove(id)
  response.status(204).end()
})

module.exports = userRouter
