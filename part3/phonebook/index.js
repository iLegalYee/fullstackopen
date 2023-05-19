require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(requestLogger)

morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'Name or number is missing' })
  }

  const person = new Person({ name, number })

  person
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson)
    })
    .catch(next)
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((numberOfEntries) => {
      const currentTime = new Date()
      const responseText = `<p>Phonebook has info for ${numberOfEntries} people</p><p>${currentTime}</p>`
      response.send(responseText)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send('Person not found')
      }
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).send('Person not found')
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
