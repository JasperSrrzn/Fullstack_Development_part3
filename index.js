require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('person', function getBody (req) {
  return req.body
})

app.use(morgan('tiny'))

app.get('/api/persons', (request, response, next)=>{
  Person
    .find({})
    .then(persons=>{
      response.json(persons.map(person=>person.toJSON()))
    })
    .catch(error=>next(error))
})

app.get('/info', (request, response, next)=>{
  Person
    .find({})
    .then(persons=>{
      response.send('<p>Phonebook has info for '+persons.length+' people</p><br/>'+new Date().toString())
    })
    .catch(error=>next(error))
})

app.get('/api/persons/:id', (request, response, next)=>{
  Person
    .findById(request.params.id)
    .then(person=>{
      if(person){
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }

    })
    .catch(error=>next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(()=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})


morgan.token('body',(req) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :response-time ms :body '))

app.post('/api/persons', (request, response, next)=>{

  if (request.body === undefined){
    return response.status(400).json({
      error: 'name must be unique'})
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person
    .save()
    .then(()=>{
      response.json(person.toJSON())
    })
    .catch(error=>next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

  const person = {
    number: request.body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson=>{
      response.json(updatedPerson.toJSON())
    })
    .catch(error=>next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name==='ValidationError'){
    console.log(error.message)
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
