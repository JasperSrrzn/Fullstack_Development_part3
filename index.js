const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('person', function getBody (req) {
  return req.body
})

app.use(morgan("tiny"))


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/api/persons', (request, response)=>{
  response.json(persons)
})

app.get('/info', (request, response)=>{
  response.send('<p>Phonebook has info for '+persons.length+' people</p><br/>'+new Date().toString())
})

app.get('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  const person = persons.find(p=>p.id === id)
  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p=>p.id!==id)
  response.status(204).end()
})


const generateId = () => {
  return Math.floor(Math.random()*10000)
}

morgan.token('body',(req, res) => { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms :body '));

app.post('/api/persons', (request, response)=>{

  const body = request.body
  if (!body.name || !body.number || persons.find(p=>p.name===body.name)){
    return response.status(400).json({
      error: 'name must be unique'})
  }

  const person = {
    name: request.body.name,
    number: request.body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
