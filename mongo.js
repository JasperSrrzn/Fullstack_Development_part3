const mongoose = require('mongoose')

if (process.argv.length<3){
  console.log('enter password')
  process.exit(1)
} else {
  const password = process.argv[2]
  const url = `mongodb+srv://fullstack:${password}@cluster0-prz4a.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = new mongoose.model('Person', personSchema)

  if (process.argv.length==3){
    Person.find({}).then(result=>{
      console.log('phonebook:')
      result.forEach(person=>{
        console.log(person.name, person.number) 
      })
      mongoose.connection.close()
    })

  } else {
    const person = new Person({
      "name": process.argv[3],
      "number": process.argv[4]
    })
    person.save().then(response=>{
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
  }
}
