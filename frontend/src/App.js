import React, { useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonsResultSet from './components/PersonsResultSet'
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'



const App = () => {

  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchName, setSearchName] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState(null)
  const [ notificationColor, setNotificationColor] = useState(null)

  useEffect(()=>{
    personService
      .getAll()
      .then(initialPersons=>{
        setPersons(initialPersons)
      })
  },[])

  const handleDelete = (personToDelete) =>  () => {
    if (window.confirm(`Delete ${personToDelete.name} ?`)){
      setPersons(persons.filter(person=>person.id !== personToDelete.id))
      personService.deletePerson(personToDelete.id)
    }
  }

  const addNewPerson = (event) => {

    event.preventDefault()

    const filteredPersons = persons.filter(person=> person.name.toLowerCase() === newName.toLowerCase())

    if (filteredPersons.length > 0 ){

      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){

        const updatedPerson = {...filteredPersons[0], number: newNumber}
        personService
              .replaceNumber(filteredPersons[0].id, updatedPerson)
              .catch(error=>{
                setNotificationColor('red')
                setNotificationMessage(`Information of ${updatedPerson.name} has already been removed from server`)
                setTimeout(()=>{
                  setNotificationMessage(null)
                  setNotificationColor(null)
                }, 5000)
                setPersons(persons.filter(person=>person.name!==newName))
              })
        setPersons(persons.map(person=>person.id !== filteredPersons[0].id?person:updatedPerson))

      }
    } else if (persons.filter(person=> person.number === newNumber).length > 0){

      alert(`${newNumber} is already used by someone in the phonebook`)

    } else {
      const newPerson = {name: newName, number: newNumber}
      personService
        .addPerson(newPerson)
        .then(returnedPerson=>{
            setPersons(persons.concat(returnedPerson))
            setNotificationColor('green')
            setNotificationMessage(`Added ${newName}`)
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationColor(null)
            },5000)
        })
        .catch(error=>{
          setNotificationColor('red')
          setNotificationMessage(error.response.data.error)
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationColor(null)
          },5000)
        })

      }
    }

  const handleNewName = (event) => setNewName(event.target.value)
  const handleNewNumber = (event) => setNewNumber(event.target.value)
  const handleSearchName = (event) => setSearchName(event.target.value)


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} color={notificationColor}/>
      < Filter searchName={searchName} handleSearchName={handleSearchName}/>
      <h3>add a new</h3>
      <PersonForm newName={newName} handleNewName={handleNewName} newNumber={newNumber} handleNewNumber={handleNewNumber} addNewPerson={addNewPerson}/>
      <h3>Numbers</h3>
      <PersonsResultSet persons={persons} searchName={searchName} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
