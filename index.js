const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
//what is require() then app get assigned whatever is the return of express function
// const requestLogger = (request, response, next) => {
//   // console.log('Method:', request.method)
//   // console.log('Path:  ', request.path)
//   // console.log('Body:  ', request.body)
//   // console.log('---')
//   next()
// } 
//the we can use the method of the app use()
app.use(express.json())
// app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

const generateID = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 100 + 1)
    : 0
  return String(maxId)
}
let persons = [ 
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

//we call the get method from the app and pass in 2 paramenter: a string and a callback function with request and response 
// parameter(does these 2 paramter is auto assign by the get method as i haven't define any request, response variable)
app.get('/info', (request, response) => {
  const entries = persons.length
  const receivedTime = new Date()
  response.send(`<p>Phonebook has info for ${entries} people </p> <p>Date: ${receivedTime}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person)
    response.json(person)

  else {
    console.log("No note found")
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const dupName = persons.find(p => p.name === body.name)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (dupName) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  const person = {
    "id": generateID(),
    "name": body.name,
    "number": body.number
  }
  persons = persons.concat(person)
  response.json(person)
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
//we have pass in 2 parameter request and response but where this come from as we haven't declare any request, response
app.use(unknownEndpoint)

const PORT = process.env.PORT||3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})