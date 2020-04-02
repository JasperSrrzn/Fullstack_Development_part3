import React from 'react';

const PersonsResultSet = ({persons, searchName, handleDelete}) => {

  return (
    <div>
    {persons.filter(person=>person.name.toLowerCase().includes(searchName.toLowerCase()))
            .map(person=><p key={person.name}>{person.name} {person.number}<button onClick={handleDelete(person)}>delete</button></p>)}
    </div>
  )
}

export default PersonsResultSet
