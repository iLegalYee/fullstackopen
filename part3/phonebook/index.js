const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')

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

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(requestLogger)
app.use(express.static('build'))


function generateId() {
    const maxId = phonebookEntries.length > 0 ? Math.max(...phonebookEntries.map((entry) => entry.id)) : 0;
    return maxId + 1;
}

morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :req-body')
)

let phonebookEntries = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
];

app.get('/api/persons', (request, response) => {
    response.json(phonebookEntries);
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'Name or number is missing' })
    }

    const existingPerson = phonebookEntries.find(person => person.name === name)
    if (existingPerson) {
        return response.status(400).json({ error: 'Person already exists' })
    }

    const id = generateId()
    const newPerson = { id, name, number, }
    phonebookEntries = [...phonebookEntries, newPerson]
    response.status(201).json(phonebookEntries)
})

app.get('/info', (request, response) => {
    const currentTime = new Date()
    const numberOfEntries = phonebookEntries.length
    const responseText = `<p>Phonebook has info for ${numberOfEntries} people</p><p>${currentTime}</p>`
    response.send(responseText)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebookEntries.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send('Person not found')
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebookEntries = phonebookEntries.filter(person => person.id !== id)
    response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})