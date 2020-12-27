const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        name: 'Arto Hellas',
        number: '04012345679',
        id: 1
    },
    {
        name: 'Marto Ellas',
        number: '04012345679',
        id: 2
    }
]

const generateId = () => {
    return parseInt(Math.random() * 100000)     
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    }

    if (persons.find(person => body.name === person.name)) {
        return response.status(400).json({
            error: `person with name ${body.name} already exists`
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person);
    response.json(person);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (!person) {
        response.status(404).end()
    } else {
        response.json(person);
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.get('/info', (request, response) => {
    response.end(`Phonebook has info for ${persons.length} people.\n\n${new Date()}`);
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})